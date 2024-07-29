import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { OrderTypesService } from './order-types.service';

const role: Role = {
  id: 1,
  name: 'role 1',
  description: 'description 1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('OrderTypeService', () => {
  let orderTypeService: OrderTypesService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
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
      prismaMock.role.findMany.mockResolvedValue([]);
    });

    it('should be defined', () => {
      expect(orderTypeService.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      orderTypeService.findMany();
      expect(prismaMock.role.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUnique', () => {
    beforeEach(() => {
      prismaMock.role.findUnique.mockResolvedValue(role);
    });

    it('should be defined', () => {
      expect(orderTypeService.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      orderTypeService.findUnique({ id: 1 });
      expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      prismaMock.role.create.mockResolvedValue(role);
    });

    it('should be defined', () => {
      expect(orderTypeService.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await orderTypeService.create({ ...role });
      expect(prismaMock.role.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      prismaMock.role.update.mockResolvedValue(role);
    });

    it('should be defined', () => {
      expect(orderTypeService.update).toBeDefined();
    });

    it('should call the prisma service', () => {
      orderTypeService.update({ where: { id: 1 }, data: { ...role } });
      expect(prismaMock.role.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      prismaMock.role.delete.mockResolvedValue(role);
    });

    it('should be defined', () => {
      expect(orderTypeService.delete).toBeDefined();
    });

    it('should call the prisma service', () => {
      orderTypeService.delete({ id: 1 });
      expect(prismaMock.role.delete).toHaveBeenCalledTimes(1);
    });
  });
});
