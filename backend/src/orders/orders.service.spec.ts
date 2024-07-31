import { Test, TestingModule } from '@nestjs/testing';
import { Order, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();
    service = module.get<OrdersService>(OrdersService);
  });

  it('should have the service defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should be defined', () => {
      expect(service.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.order.findMany.mockResolvedValue([]);
      service.findMany();
      expect(prismaMock.order.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUnique', () => {
    it('should be defined', () => {
      expect(service.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.order.findUnique.mockResolvedValue({} as Order);
      service.findUnique({} as Prisma.OrderWhereUniqueInput);
      expect(prismaMock.order.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      prismaMock.$transaction.mockResolvedValue({} as Order);
      await service.create({} as CreateOrderDto, 1);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });

    it('should call the prisma service', () => {
      service.update('1', {} as UpdateOrderDto, 1);
      expect(prismaMock.order.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(service.delete).toBeDefined();
    });

    it('should call the prisma service', () => {
      service.delete({} as Prisma.OrderWhereUniqueInput);
      expect(prismaMock.order.delete).toHaveBeenCalledTimes(1);
    });
  });
});
