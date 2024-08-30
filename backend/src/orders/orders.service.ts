import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateOrderDto,
  UpdateOrderDto,
  MarkPrintedDto,
  MarkPayDto,
  MarkTakenDto,
} from './dto';
import { OrderEntity } from './entities/order.entity';
import { orderNumber } from '../helpers';
import { CustomersService } from '../customers/customers.service';
import { ADMIN } from '../types';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly customersService: CustomersService,
  ) { }

  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<OrderEntity[]> {
    try {
      const { date, customer, description, orderDetails } = createOrderDto;
      const number = orderNumber('DB-', 3);
      const customerUpperCase = customer.toUpperCase();
      return await this.prismaService.$transaction(
        async (prisma): Promise<OrderEntity[] | any> => {
          try {
            await this.customersService.create({ name: customerUpperCase }, userId);
            return await prisma.order.create({
              data: {
                number,
                date,
                customer: customerUpperCase,
                description,
                userId,
                OrderDetails: {
                  create: orderDetails,
                },
              },
              include: {
                OrderDetails: {
                  select: {
                    name: true,
                    price: true,
                    width: true,
                    height: true,
                    qty: true,
                    design: true,
                    eyelets: true,
                    shiming: true,
                    description: true,
                    MarkedPrinted: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                    password: false
                  },
                },
              },
            });
          } catch (error) {
            this.logger.error(error);
            throw new Error(error);
          }
        },
      );
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  findMany(): Promise<OrderEntity[] | null> {
    try {
      return this.prismaService.order.findMany({
        include: {
          OrderDetails: {
            select: {
              id: true,
              name: true,
              price: true,
              width: true,
              height: true,
              qty: true,
              design: true,
              eyelets: true,
              shiming: true,
              description: true,
              MarkedPrinted: true,
              deleted: true,
              orderId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          MarkedPay: true,
          MarkedTaken: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              password: false
            },
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async filter(params: {
    startDate?: Date;
    endDate?: Date;
    customer?: string;
    userId?: number;
    sortBy?: string;
    sortOrder?: Prisma.SortOrder;
    page?: number;
    pageSize?: number;
  }) {
    const {
      startDate,
      endDate,
      customer,
      userId,
      sortBy = 'date', // Default sorting by 'createdAt'
      sortOrder = 'desc', // Default sorting order 'desc'
      page,
      pageSize,
    } = params;

    const where: Prisma.OrderWhereInput = {};

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (customer) {
      where.customer = customer;
    }

    if (userId) {
      where.userId = userId;
    }

    let skip: number | undefined;
    let take: number | undefined;

    if (page && pageSize) {
      skip = (page - 1) * pageSize;
      take = pageSize;
    }

    const orders = await this.prismaService.order.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take,
      include: {
        OrderDetails: {
          select: {
            id: true,
            name: true,
            price: true,
            width: true,
            height: true,
            qty: true,
            design: true,
            eyelets: true,
            shiming: true,
            description: true,
            MarkedPrinted: true,
          },
        },
        MarkedPay: true,
        MarkedTaken: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            password: false
          },
        },
      },
    });

    const total = await this.prismaService.order.count({
      where,
    });

    return {
      data: orders,
      meta: {
        total,
        page: page ?? 1,
        pageSize: pageSize ?? total,
        totalPages: pageSize ? Math.ceil(total / pageSize) : 1,
      },
    };
  }

  async findUnique(
    where: Prisma.OrderWhereUniqueInput,
  ): Promise<OrderEntity | null> {
    const order = await this.prismaService.order.findUnique({
      where,
      include: {
        OrderDetails: {
          select: {
            id: true,
            name: true,
            price: true,
            width: true,
            height: true,
            qty: true,
            design: true,
            eyelets: true,
            shiming: true,
            description: true,
            MarkedPrinted: true,
            deleted: true,
            orderId: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        MarkedPay: true,
        MarkedTaken: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            password: false
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId: number,
  ): Promise<OrderEntity | any> {
    const { date, customer, description, orderDetails } = updateOrderDto;
    const newOd = orderDetails!.filter(od => !('id' in od)); // order detail baru yang ditambahkan
    const existOd = orderDetails!.filter(od => "id" in od && !od.deleted);
    const updatedOd = existOd?.map((od) => ({ where: { id: od.id }, data: { ...od } }));
    const deletedOd = orderDetails?.filter(od => od.deleted === true)
      .map(od => od.id);

    try {
      await this.prismaService.orderDetail.deleteMany({
        where: { id: { in: deletedOd } }
      });
      return await this.prismaService.order.update({
        where: { id },
        data: {
          date,
          customer,
          description,
          userId,
          OrderDetails: {
            updateMany: updatedOd,
            createMany: {
              data: newOd
            }
          },
        },
        include: {
          OrderDetails: {
            select: {
              name: true,
              price: true,
              width: true,
              height: true,
              qty: true,
              design: true,
              eyelets: true,
              shiming: true,
              description: true,
              MarkedPrinted: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              password: false
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(error);
    }
  }

  async delete(where: Prisma.OrderWhereUniqueInput, role: string): Promise<OrderEntity> {
    const order = await this.findUnique(where);
    // selain admin,
    // order hanya bisa dihapus jika belum dilakukan pembayaran atau
    // belum diambil
    if (role !== ADMIN && (order?.MarkedPay || order?.MarkedTaken)) {
      throw new ForbiddenException('403 Forbidden');
    }
    try {
      return this.prismaService.order.delete({
        where,
        include: {
          OrderDetails: true,
          MarkedPay: true,
          MarkedTaken: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  markPrint(orderDetailId: string, markPrintedDto: MarkPrintedDto, printedById: number) {
    const { status, description, printAt } = markPrintedDto;
    try {
      return this.prismaService.printedStatus.upsert({
        where: { orderDetailId },
        update: {
          status,
          printAt,
          description,
          printedById,
        },
        create: {
          status,
          printAt,
          description,
          orderDetailId,
          printedById,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  markPay(orderId: string, markPayDto: MarkPayDto, markedById: number) {
    const { status, description, payAt } = markPayDto;
    try {
      return this.prismaService.payStatus.upsert({
        where: { orderId },
        update: {
          status,
          payAt,
          description,
          markedById,
        },
        create: {
          status,
          payAt,
          description,
          orderId,
          markedById,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  markTaken(orderId: string, markTakenDto: MarkTakenDto, markedById: number) {
    const { status, description, takenAt } = markTakenDto;
    try {
      return this.prismaService.takenStatus.upsert({
        where: { orderId },
        update: {
          status,
          takenAt,
          description,
          markedById,
        },
        create: {
          status,
          takenAt,
          description,
          orderId,
          markedById,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  cancelStatus({ type, orderId, orderDetailId }: { type: CancelType, orderId?: string, orderDetailId?: string }) {
    switch (type) {
      case CancelType.PRINT:
        return this.prismaService.printedStatus.delete({ where: { orderDetailId } });

      case CancelType.PAY:
        return this.prismaService.payStatus.delete({ where: { orderId } });

      case CancelType.TAKEN:
        return this.prismaService.takenStatus.delete({ where: { orderId } });
    }
  }
}

export const enum CancelType {
  PRINT,
  PAY,
  TAKEN
}