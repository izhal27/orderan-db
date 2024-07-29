import { Test, TestingModule } from '@nestjs/testing';
import { OrderType, PrismaClient } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { OrderTypesService } from './order-types.service';

describe('OrderTypesService', () => {
  let orderTypeService: OrderTypesService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderTypesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();
    orderTypeService = module.get<OrderTypesService>(OrderTypesService);
  });

  it('should have the service defined', () => {
    expect(orderTypeService).toBeDefined();
  });

  describe('findMany', () => {
    it('should be defined', () => {
      expect(orderTypeService.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.orderType.findMany.mockResolvedValue([]);
      orderTypeService.findMany();
      expect(prismaMock.orderType.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUnique', () => {
    it('should be defined', () => {
      expect(orderTypeService.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.orderType.findUnique.mockResolvedValue({} as OrderType);
      orderTypeService.findUnique({ id: 1 });
      expect(prismaMock.orderType.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(orderTypeService.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await orderTypeService.create({} as OrderType);
      expect(prismaMock.orderType.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(orderTypeService.update).toBeDefined();
    });

    it('should call the prisma service', () => {
      orderTypeService.update({ where: { id: 1 }, data: {} as OrderType });
      expect(prismaMock.orderType.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(orderTypeService.delete).toBeDefined();
    });

    it('should call the prisma service', () => {
      orderTypeService.delete({ id: 1 });
      expect(prismaMock.orderType.delete).toHaveBeenCalledTimes(1);
    });
  });
});
