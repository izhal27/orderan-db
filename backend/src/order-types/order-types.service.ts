import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderType, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OrderTypesService {
  constructor(private readonly prismaService: PrismaService) { }

  create(data: Prisma.OrderTypeCreateInput): Promise<OrderType> {
    return this.prismaService.orderType.create({ data });
  }

  findMany(): Promise<OrderType[] | null> {
    return this.prismaService.orderType.findMany();
  }

  async findUnique(
    where: Prisma.OrderTypeWhereUniqueInput,
  ): Promise<OrderType | null> {
    const orderType = await this.prismaService.orderType.findUnique({ where });

    return orderType;
  }

  async update(params: {
    where: Prisma.OrderTypeWhereUniqueInput;
    data: Prisma.OrderTypeUpdateInput;
  }): Promise<OrderType> {
    const { where, data } = params;
    return this.prismaService.orderType.update({ where, data });
  }

  async delete(where: Prisma.OrderTypeWhereUniqueInput): Promise<OrderType> {
    return this.prismaService.orderType.delete({ where });
  }
}