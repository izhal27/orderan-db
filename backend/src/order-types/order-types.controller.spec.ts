import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { OrderTypesController } from './order-types.controller';
import { OrderTypesService } from './order-types.service';
import { CreateOrderTypeDto, UpdateOrderTypeDto } from './dto';


describe('OrderTypesController', () => {
  let controller: OrderTypesController;
  let serviceMock: DeepMockProxy<OrderTypesService>;

  beforeAll(async () => {
    serviceMock = mockDeep<OrderTypesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderTypesController],
      providers: [
        {
          provide: OrderTypesService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<OrderTypesController>(OrderTypesController);
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
      controller.findOne(1);
      expect(serviceMock.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(serviceMock.create).toBeDefined();
    });

    it('should call RolesService.create', () => {
      controller.create({} as CreateOrderTypeDto);
      expect(serviceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(serviceMock.update).toBeDefined();
    });

    it('should call RolesService.update', () => {
      controller.update(1, {} as UpdateOrderTypeDto);
      expect(serviceMock.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(serviceMock.delete).toBeDefined();
    });

    it('should call UsersService.delete', () => {
      controller.delete(1);
      expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    });
  });
});
