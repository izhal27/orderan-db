import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order[]> {
    const { number, date, customer, description, orderDetails } = createOrderDto;
    let result;
    await this.prismaService.$transaction(async (prisma) => {
      return prisma.order.create({
        data: {
          number,
          date,
          customer,
          description,
          userId,
          orderDetails: {
            create: orderDetails
          }
        }, include: {
          orderDetails: true
        }
      })
    }).then(data => { result = data })
      .catch(error => console.log(JSON.stringify(error, null, 4)));
    return result;
  }

  findMany(): Promise<Order[] | null> {
    return this.prismaService.order.findMany({ include: { orderDetails: true } });
  }

  async findUnique(where: Prisma.OrderWhereUniqueInput): Promise<Order | null> {
    const order = await this.prismaService.order.findUnique({ where, include: { orderDetails: true } });
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
