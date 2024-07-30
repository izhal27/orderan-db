import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CreateOrderDetailDto } from './dto/create-order-detail.dto';

@Injectable()
export class OrderDetailsService {
  constructor(private readonly prismaService: PrismaService) { }

  createManyAndReturn(orderId: string, createOrderDetailDto: CreateOrderDetailDto[]) {
    return this.prismaService.orderDetail.createManyAndReturn({ data: createOrderDetailDto });
  }
}
