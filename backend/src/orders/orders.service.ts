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
import { WebSocketService } from '../lib/websocket.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly customersService: CustomersService,
    private readonly webSocketService: WebSocketService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<OrderEntity[]> {
    try {
      const { date, customer, description, orderDetails } = createOrderDto;
      const number = orderNumber('DB-', 3);
      const customerUpperCase = customer.toUpperCase();
      await this.customersService.create({ name: customerUpperCase }, userId);
      const order = await this.prismaService.$transaction(
        async (prisma): Promise<OrderEntity[] | any> => {
          try {
            const result = await prisma.order.create({
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
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                    password: false,
                  },
                },
              },
            });
            return result;
          } catch (error) {
            this.logger.error(error);
            throw new Error(error);
          }
        },
      );
      this.webSocketService.emitEvent('order:new', order, userId);
      return order;
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
              password: false,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async filter(params: {
    startDate?: Date;
    endDate?: Date;
    orderNumber?: string;
    customer?: string;
    user?: string;
    sortBy?: string;
    sortOrder?: Prisma.SortOrder;
    page?: number;
    pageSize?: number;
  }) {
    const {
      startDate,
      endDate,
      orderNumber,
      customer,
      user,
      sortBy = 'updatedAt', // Default sorting by 'createdAt'
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

    if (orderNumber) {
      where.number = {
        contains: orderNumber,
      };
    }

    if (customer) {
      where.customer = {
        contains: customer,
      };
    }

    if (user) {
      where.user = {
        username: {
          contains: user,
        },
        name: {
          contains: user,
        },
      };
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
        updatedAt: sortOrder,
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
            MarkedPrinted: {
              include: {
                PrintedBy: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        MarkedPay: {
          include: {
            MarkedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
        },
        MarkedTaken: {
          include: {
            MarkedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            password: false,
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
            MarkedPrinted: {
              include: {
                PrintedBy: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
            deleted: true,
            orderId: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        MarkedPay: {
          include: {
            MarkedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
        },
        MarkedTaken: {
          include: {
            MarkedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
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
    const order = await this.findUnique({ id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const { date, customer, description, orderDetails } = updateOrderDto;
    // order detail yang baru ditambahkan
    const newOd = orderDetails!.filter((od) => !('id' in od));
    // order detail yang sudah ada dan yang ingin diupdate
    const updatedOd = orderDetails!
      .filter((od) => 'id' in od && !od.deleted)
      .map((od) => ({
        where: { id: od.id },
        data: { ...od },
      }));
    // order detail yang sudah ada dan yang ingin dihapus
    const deletedOd = orderDetails!
      .filter((od) => od.deleted && 'id' in od)
      .map((od) => od.id);
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        await prisma.orderDetail.deleteMany({
          where: { id: { in: deletedOd } },
        });
        return await prisma.order.update({
          where: { id },
          data: {
            date,
            customer,
            description,
            OrderDetails: {
              updateMany: updatedOd,
              createMany: {
                data: newOd,
              },
            },
          },
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
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
        });
      });
      this.webSocketService.emitEvent('order:update', result, userId);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async delete(
    where: Prisma.OrderWhereUniqueInput,
    role: string,
    userId: number,
  ): Promise<OrderEntity> {
    const order = await this.findUnique(where);
    // selain admin,
    // order hanya bisa dihapus jika belum dilakukan pembayaran atau
    // belum diambil
    if (role !== ADMIN && (order?.MarkedPay || order?.MarkedTaken)) {
      throw new ForbiddenException('403 Forbidden');
    }
    try {
      const result = await this.prismaService.order.delete({
        where,
        include: {
          OrderDetails: true,
          MarkedPay: true,
          MarkedTaken: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
      });
      this.webSocketService.emitEvent('order:delete', result.id, userId);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async markPrint(
    orderDetailId: string,
    markPrintedDto: MarkPrintedDto,
    printedById: number,
  ) {
    const { status, description, printAt } = markPrintedDto;
    try {
      const result = await this.prismaService.printedStatus.upsert({
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
        include: {
          PrintedBy: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      });
      this.webSocketService.emitEvent('order:markPrint', result, printedById);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async markPay(orderId: string, markPayDto: MarkPayDto, markedById: number) {
    const { status, description, payAt } = markPayDto;
    try {
      const result = await this.prismaService.payStatus.upsert({
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
        include: {
          MarkedBy: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      });
      this.webSocketService.emitEvent('order:markPay', result, markedById);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async markTaken(
    orderId: string,
    markTakenDto: MarkTakenDto,
    markedById: number,
  ) {
    const { status, description, takenAt } = markTakenDto;
    try {
      const result = await this.prismaService.takenStatus.upsert({
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
        include: {
          MarkedBy: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      });
      this.webSocketService.emitEvent('order:markTaken', result, markedById);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async cancelStatus({
    type,
    orderId,
    orderDetailId,
    userId,
  }: {
    type: CancelType;
    orderId?: string;
    orderDetailId?: string;
    userId: number;
  }) {
    switch (type) {
      case CancelType.PRINT:
        const resultPrint = await this.prismaService.printedStatus.update({
          where: { orderDetailId: orderDetailId },
          data: { status: false, printedById: userId }, // cancel by userId
          include: {
            PrintedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
        });
        this.webSocketService.emitEvent(
          'order:cancelPrint',
          resultPrint,
          userId,
        );
        return resultPrint;

      case CancelType.PAY:
        const resultPay = await this.prismaService.payStatus.update({
          where: { orderId },
          data: { status: false },
          include: {
            MarkedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
        });
        this.webSocketService.emitEvent('order:cancelPay', resultPay, userId);
        return resultPay;

      case CancelType.TAKEN:
        const resultTaken = await this.prismaService.takenStatus.update({
          where: { orderId },
          data: { status: false },
          include: {
            MarkedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
        });
        this.webSocketService.emitEvent(
          'order:cancelTaken',
          resultTaken,
          userId,
        );
        return resultTaken;
    }
  }
}

export const enum CancelType {
  PRINT,
  PAY,
  TAKEN,
}
