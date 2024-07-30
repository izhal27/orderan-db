import { Test, TestingModule } from '@nestjs/testing';
import { OrderType, PrismaClient } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { OrderTypesService } from './order-types.service';

describe('OrderTypesService', () => {
  let service: OrderTypesService;
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
    service = module.get<OrderTypesService>(OrderTypesService);
  });

  it('should have the service defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should be defined', () => {
      expect(service.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.orderType.findMany.mockResolvedValue([]);
      service.findMany();
      expect(prismaMock.orderType.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUnique', () => {
    it('should be defined', () => {
      expect(service.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.orderType.findUnique.mockResolvedValue({} as OrderType);
      service.findUnique({ id: 1 });
      expect(prismaMock.orderType.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await service.create({} as OrderType);
      expect(prismaMock.orderType.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });

    it('should call the prisma service', () => {
      service.update({ where: { id: 1 }, data: {} as OrderType });
      expect(prismaMock.orderType.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(service.delete).toBeDefined();
    });

    it('should call the prisma service', () => {
      service.delete({ id: 1 });
      expect(prismaMock.orderType.delete).toHaveBeenCalledTimes(1);
    });
  });
});
