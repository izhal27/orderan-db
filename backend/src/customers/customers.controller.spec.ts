import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

describe('CustomersController', () => {
  let controller: CustomersController;
  let serviceMock: DeepMockProxy<CustomersService>;

  beforeAll(async () => {
    serviceMock = mockDeep<CustomersService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
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
      controller.findOne('1');
      expect(serviceMock.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(serviceMock.create).toBeDefined();
    });

    it('should call RolesService.create', () => {
      controller.create({} as CreateCustomerDto, 1);
      expect(serviceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(serviceMock.update).toBeDefined();
    });

    it('should call RolesService.update', () => {
      controller.update('1', {} as UpdateCustomerDto);
      expect(serviceMock.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(serviceMock.delete).toBeDefined();
    });

    it('should call UsersService.delete', () => {
      controller.delete('1');
      expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    });
  });
});
