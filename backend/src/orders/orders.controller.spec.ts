import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  MarkPrintedDto,
  MarkPayDto,
  MarkTakenDto
} from './dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let serviceMock: DeepMockProxy<OrdersService>;

  beforeAll(async () => {
    serviceMock = mockDeep<OrdersService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMany', () => {
    it('should be defined', () => {
      expect(serviceMock.findMany).toBeDefined();
    });

    it('should call OrdersService.findMany', () => {
      controller.findAll();
      expect(serviceMock.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(serviceMock.findUnique).toBeDefined();
    });

    it('should call OrdersService.findUnique', () => {
      controller.findUnique('aaa');
      expect(serviceMock.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(serviceMock.create).toBeDefined();
    });

    it('should call OrdersService.create', () => {
      controller.create({} as CreateOrderDto, 1);
      expect(serviceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(serviceMock.update).toBeDefined();
    });

    it('should call OrdersService.update', () => {
      controller.update('aaa', {} as UpdateOrderDto, 1);
      expect(serviceMock.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(serviceMock.delete).toBeDefined();
    });

    it('should call OrdersService.delete', () => {
      controller.delete('aaa', 'admin');
      expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('markPrint', () => {
    it('should be defined', () => {
      expect(serviceMock.markPrint).toBeDefined();
    });

    it('should call OrdersService.markPrinted', () => {
      controller.markPrinted('aaa', {} as MarkPrintedDto, 1);
      expect(serviceMock.markPrint).toHaveBeenCalledTimes(1);
    });
  });

  describe('markPay', () => {
    it('should be defined', () => {
      expect(serviceMock.markPay).toBeDefined();
    });

    it('should call OrdersService.markPay', () => {
      controller.markPay('aaa', {} as MarkPayDto, 1);
      expect(serviceMock.markPay).toHaveBeenCalledTimes(1);
    });
  });

  describe('markTaken', () => {
    it('should be defined', () => {
      expect(serviceMock.markTaken).toBeDefined();
    });

    it('should call OrdersService.markTaken', () => {
      controller.markTaken('aaa', {} as MarkTakenDto, 1);
      expect(serviceMock.markTaken).toHaveBeenCalledTimes(1);
    });
  });
});
