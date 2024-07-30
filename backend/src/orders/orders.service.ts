import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { OrderDetailsService } from '../order-details/order-details.service';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor
    (private readonly prismaService: PrismaService,
      private readonly orderDetailsService: OrderDetailsService
    ) { }

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    let result;
    await this.prismaService.$transaction(async (prisma) => {
      const { orderDetails, ...orderObj } = createOrderDto;
      const order = await prisma.order.create({ data: orderObj }) as OrderEntity;
      const resOrderDetails = await this.orderDetailsService.createManyAndReturn(order.id, orderDetails);
      order.orderDetails = resOrderDetails;
      return order;
    }).then(data => { result = data })
      .catch(error => console.log(JSON.stringify(error, null, 4)));
    return result;
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

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    throw new NotImplementedException('This method is Under Construction');
    // return this.prismaService.order.update({ where: { id }, data: updateOrderDto });
  }

  delete(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
    return this.prismaService.order.delete({ where });
  }
}
