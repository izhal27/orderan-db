import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OrderDetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  createMany(param: Prisma.OrderDetailCreateManyAndReturnArgs) {
    return this.prismaService.orderDetail.createManyAndReturn(param);
  }
}
