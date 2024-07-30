import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prismaService.order.create({ data });
  }

  findMany(): Promise<Order[] | null> {
    return this.prismaService.order.findMany();
  }

  async findUnique(where: Prisma.OrderWhereUniqueInput): Promise<Order | null> {
    const order = await this.prismaService.order.findUnique({ where });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUpdateInput;
  }): Promise<Order> {
    const { where, data } = params;
    return this.prismaService.order.update({ where, data });
  }

  delete(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
    return this.prismaService.order.delete({ where });
  }
}
