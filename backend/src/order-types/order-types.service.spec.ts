import { Test, TestingModule } from '@nestjs/testing';
import { OrderType, PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'nestjs-prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { OrderTypesService } from './order-types.service';

const orderType: OrderType = {
  id: 1,
  name: 'flexy',
  price: new Decimal(1000),
  description: 'description 1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
    beforeEach(() => {
      prismaMock.orderType.findMany.mockResolvedValue([]);
    });

    it('should be defined', () => {
      expect(orderTypeService.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      orderTypeService.findMany();
      expect(prismaMock.orderType.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUnique', () => {
    beforeEach(() => {
      prismaMock.orderType.findUnique.mockResolvedValue(orderType);
    });

    it('should be defined', () => {
      expect(orderTypeService.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      orderTypeService.findUnique({ id: 1 });
      expect(prismaMock.orderType.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      prismaMock.orderType.create.mockResolvedValue(orderType);
    });

    it('should be defined', () => {
      expect(orderTypeService.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await orderTypeService.create({ ...orderType });
      expect(prismaMock.orderType.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      prismaMock.orderType.update.mockResolvedValue(orderType);
    });

    it('should be defined', () => {
      expect(orderTypeService.update).toBeDefined();
    });

    it('should call the prisma service', () => {
      orderTypeService.update({ where: { id: 1 }, data: { ...orderType } });
      expect(prismaMock.orderType.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      prismaMock.orderType.delete.mockResolvedValue(orderType);
    });

    it('should be defined', () => {
      expect(orderTypeService.delete).toBeDefined();
    });

    it('should call the prisma service', () => {
      orderTypeService.delete({ id: 1 });
      expect(prismaMock.orderType.delete).toHaveBeenCalledTimes(1);
    });
  });
});
