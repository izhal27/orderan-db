import {
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as randomstring from 'randomstring';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { features } from 'process';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prismaService: PrismaService) { }

  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<OrderEntity[]> {
    const { date, customer, description, orderDetails } = createOrderDto;
    const number =
      'DB-' +
      randomstring.generate({
        charset: 'alphanumeric',
        length: 10,
        capitalization: 'uppercase',
      });
    return await this.prismaService.$transaction(
      async (prisma): Promise<OrderEntity[] | any> => {
        try {
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
            },
          });
        } catch (error) {
          this.logger.error(error);
          throw new Error(error);
        }
      },
    );
  }

  findMany(): Promise<OrderEntity[] | null> {
    return this.prismaService.order.findMany({
      include: { orderDetails: true },
    });
  }

  async findUnique(
    where: Prisma.OrderWhereUniqueInput,
  ): Promise<OrderEntity | null> {
    const order = await this.prismaService.order.findUnique({
      where,
      include: { orderDetails: true },
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
    const updatedOd = orderDetails?.map(od => ({
      where: {
        id: od.id
      }, data: {
        ...od
      }
    }));
    return await this.prismaService.$transaction(
      async (prisma): Promise<OrderEntity[] | any> => {
        try {
          return prisma.order.update({
            where: {
              id
            },
            data: {
              date,
              customer,
              description,
              updatedById: userId,
              orderDetails: {
                updateMany: updatedOd
              }
            },
            include: {
              orderDetails: true
            }
          });
        } catch (error) {
          this.logger.error(error);
          throw new Error(error);
        }
      },
    );
  }

  delete(where: Prisma.OrderWhereUniqueInput): Promise<OrderEntity | any> {
    return this.prismaService.order.delete({ where });
  }
}
