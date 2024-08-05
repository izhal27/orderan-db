import {
  BadRequestException,
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
      const number = orderNumber('DB-', 4);
      return await this.prismaService.$transaction(
        async (prisma): Promise<OrderEntity[] | any> => {
          try {
            await this.customersService.create({ name: customer }, userId);
            return await prisma.order.create({
              data: {
                number,
                date,
                customer,
                description,
                userId,
                orderDetails: {
                  create: orderDetails,
                },
              },
              include: {
                orderDetails: true,
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
          orderDetails: true,
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
      throw new BadRequestException(error);
    }
  }

  async findUnique(
    where: Prisma.OrderWhereUniqueInput,
  ): Promise<OrderEntity | null> {
    const order = await this.prismaService.order.findUnique({
      where,
      include: {
        orderDetails: true,
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
    const updatedOd = orderDetails?.map((od) => ({
      where: { id: od.id },
      data: { ...od },
    }));
    try {
      return await this.prismaService.order.update({
        where: { id },
        data: {
          date,
          customer,
          description,
          orderDetails: {
            updateMany: updatedOd,
          },
        },
        include: {
          orderDetails: true,
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

  delete(where: Prisma.OrderWhereUniqueInput): Promise<OrderEntity> {
    try {
      return this.prismaService.order.delete({
        where,
        include: { orderDetails: true },
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
}
