import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OrderType, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OrderTypesService {
  private readonly logger = new Logger();

  constructor(private readonly prismaService: PrismaService) { }

  create(data: Prisma.OrderTypeCreateInput): Promise<OrderType> {
    try {
      return this.prismaService.orderType.create({ data });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  findMany(): Promise<OrderType[]> {
    try {
      return this.prismaService.orderType.findMany();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findUnique(
    where: Prisma.OrderTypeWhereUniqueInput,
  ): Promise<OrderType | null> {
    const orderType = await this.prismaService.orderType.findUnique({ where });
    if (!orderType) {
      throw new NotFoundException('Order type not found');
    }
    return orderType;
  }

  update(params: {
    where: Prisma.OrderTypeWhereUniqueInput;
    data: Prisma.OrderTypeUpdateInput;
  }): Promise<OrderType> {
    try {
      const { where, data } = params;
      return this.prismaService.orderType.update({ where, data });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  delete(where: Prisma.OrderTypeWhereUniqueInput): Promise<OrderType> {
    try {
      return this.prismaService.orderType.delete({ where });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
