import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

describe('RolesController', () => {
  let controller: RolesController;
  let serviceMock: DeepMockProxy<RolesService>;

  beforeAll(async () => {
    serviceMock = mockDeep<RolesService>();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = app.get<RolesController>(RolesController);
  });

  it('should be defined"', () => {
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
      controller.create({} as CreateRoleDto);
      expect(serviceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(serviceMock.update).toBeDefined();
    });

    it('should call RolesService.update', () => {
      controller.update(1, {} as UpdateRoleDto);
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
