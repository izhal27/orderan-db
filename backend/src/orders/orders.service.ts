import {
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as randomstring from 'randomstring';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<Order[]> {
    const { date, customer, description, orderDetails } = createOrderDto;
    const number =
      'DB-' +
      randomstring.generate({
        charset: 'alphanumeric',
        length: 10,
        capitalization: 'uppercase',
      });
    return await this.prismaService.$transaction(
      async (prisma): Promise<Order[] | any> => {
        try {
          await prisma.order.create({
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

  findMany(): Promise<Order[] | null> {
    return this.prismaService.order.findMany({
      include: { orderDetails: true },
    });
  }

  async findUnique(where: Prisma.OrderWhereUniqueInput): Promise<Order | null> {
    const order = await this.prismaService.order.findUnique({
      where,
      include: { orderDetails: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    throw new NotImplementedException('This method is Under Construction');
    // return this.prismaService.order.update({ where: { id }, data: updateOrderDto });
  }

  delete(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
    return this.prismaService.order.delete({ where });
  }
}
