import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from 'nestjs-prisma';
import { Role } from '@prisma/client';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';

describe('RolesController', () => {
  let controller: RolesController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService, PrismaService],
    }).compile();

    controller = app.get<RolesController>(RolesController);
  });

  it('should be defined"', () => {
    expect(controller).toBeDefined();
  });

  // create method
  describe('roles controller', () => {
    it('should register new role', async () => {
      const newRole = {
        name: 'New role',
        description: 'New description'
      };

      const mockRegisterResponse: Role = {
        id: 1,
        name: 'New role',
        description: 'New description',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // See here -> we mock registerUser function from roles.controller.ts
      // to return mockRegisterResponse
      jest
        .spyOn(controller, 'create')
        .mockResolvedValue(mockRegisterResponse);

      // See here -> we call create method from roles.controller.ts
      // with newRole as parameter
      const result = await controller.create(newRole);

      // See here -> we expect result to be mockRegisterResponse
      expect(result).toEqual(mockRegisterResponse);
    });
  });

  // test register error due to name already registered
  it('should throw error if name already registered', async () => {
    const registeredUser = {
      name: 'New role',
      description: 'New description'
    };

    jest
      .spyOn(controller, 'create')
      .mockRejectedValue(new ConflictException());

    const register = controller.create(registeredUser);

    await expect(register).rejects.toThrow(ConflictException);
  });

  // test register error due to missing some fields
  it('should throw error if required fields is missing', async () => {
    jest
      .spyOn(controller, 'create')
      .mockRejectedValue(new BadRequestException());

    const register = controller.create(new CreateRoleDto());

    await expect(register).rejects.toThrow(BadRequestException);
  });
});