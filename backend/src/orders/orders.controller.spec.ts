import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';

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

    it('should call RolesService.findMany', () => {
      controller.findAll();
      expect(serviceMock.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(serviceMock.findUnique).toBeDefined();
    });

    it('should call RolesService.findUnique', () => {
      controller.findUnique('aaa');
      expect(serviceMock.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(serviceMock.create).toBeDefined();
    });

    it('should call RolesService.create', () => {
      controller.create({} as CreateOrderDto, 1);
      expect(serviceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(serviceMock.update).toBeDefined();
    });

    it('should call RolesService.update', () => {
      controller.update('aaa', {} as UpdateOrderDto, 1);
      expect(serviceMock.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(serviceMock.delete).toBeDefined();
    });

    it('should call UsersService.delete', () => {
      controller.delete('aaa');
      expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    });
  });
});
