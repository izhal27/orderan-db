import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let serviceMock: DeepMockProxy<UsersService>;

  beforeAll(async () => {
    serviceMock = mockDeep<UsersService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMany', () => {
    it('should be defined', () => {
      expect(serviceMock.findMany).toBeDefined();
    });

    it('should call UsersService.findMany', () => {
      controller.findAll();
      expect(serviceMock.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(serviceMock.findUnique).toBeDefined();
    });

    it('should call UsersService.findUnique', () => {
      controller.findOne(1);
      expect(serviceMock.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(serviceMock.create).toBeDefined();
    });

    it('should call UsersService.create', () => {
      controller.create({} as CreateUserDto, null);
      expect(serviceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(serviceMock.update).toBeDefined();
    });

    it('should call UsersService.update', async () => {
      await controller.update(1, {} as UpdateUserDto, null);
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
