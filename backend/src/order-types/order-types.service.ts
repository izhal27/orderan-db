import { Injectable, NotImplementedException } from '@nestjs/common';
import { OrderType, Prisma } from '@prisma/client';

@Injectable()
export class OrderTypesService {
  create(data: Prisma.OrderTypeCreateInput): Promise<OrderType> {
    throw new NotImplementedException();
  }

  findMany(): Promise<OrderType | null> {
    throw new NotImplementedException();
  }

  findUnique(
    where: Prisma.OrderTypeWhereUniqueInput,
  ): Promise<OrderType | null> {
    throw new NotImplementedException();
  }

  update(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUpdateInput;
  }): Promise<OrderType> {
    throw new NotImplementedException();
  }

  delete(where: Prisma.OrderTypeWhereUniqueInput): Promise<OrderType> {
    throw new NotImplementedException();
  }
}
