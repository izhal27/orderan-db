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
  ): Promise<OrderEntity> {
    throw new NotImplementedException('This method is Under Construction');
    // return this.prismaService.order.update({ where: { id }, data: updateOrderDto });
  }

  delete(where: Prisma.OrderWhereUniqueInput): Promise<OrderEntity | any> {
    return this.prismaService.order.delete({ where });
  }
}
