import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { OrderDetail, Prisma, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { OrderDetailsService } from './order-details.service';

describe('OrderDetailsService', () => {
  let service: OrderDetailsService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<OrderDetailsService>(OrderDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMany', () => {
    it('should be defined', () => {
      expect(service.createManyAndReturn).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.orderDetail.createManyAndReturn.mockResolvedValue(
        {} as OrderDetail[],
      );
      service.createManyAndReturn({} as Prisma.OrderDetailCreateManyAndReturnArgs);
      expect(prismaMock.orderDetail.createManyAndReturn).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
