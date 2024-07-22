import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

describe('RolesController', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService, PrismaService],
    }).compile();

    rolesController = app.get<RolesController>(RolesController);
    rolesService = app.get<RolesService>(RolesService);
  });

  it('should be defined"', () => {
    expect(rolesController).toBeDefined();
  });

  describe('roles controller', () => {
    describe('create role', () => {
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

        jest
          .spyOn(rolesService, 'create')
          .mockResolvedValue(mockRegisterResponse);

        const result = await rolesController.create(newRole);

        expect(rolesService.create).toHaveBeenCalledWith(newRole);
        expect(result).toEqual(mockRegisterResponse);
      });

      it('should throw error if name already registered', async () => {
        const registeredUser = {
          name: 'New role',
          description: 'New description'
        };

        jest
          .spyOn(rolesService, 'create')
          .mockRejectedValue(new ConflictException());

        const register = rolesController.create(registeredUser);

        await expect(rolesService.create).rejects.toThrow(ConflictException);
        await expect(register).rejects.toThrow(ConflictException);
      });

      it('should throw error if required fields is missing', async () => {
        jest
          .spyOn(rolesService, 'create')
          .mockRejectedValue(new BadRequestException());

        const register = rolesController.create(new CreateRoleDto());

        await expect(rolesService.create).rejects.toThrow(BadRequestException);
        await expect(register).rejects.toThrow(BadRequestException);
      });
    });

    describe('get role', () => {
      it('should return a role', async () => {
        const role = {
          id: 1,
          name: 'New role',
          description: 'New description',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        jest
          .spyOn(rolesService, 'findOne')
          .mockResolvedValue(role);

        const result = await rolesController.findOne(1);

        expect(rolesService.findOne).toHaveBeenCalledWith(1);
        expect(result).toEqual(role);
      });

      it('should throw error if role not found', async () => {
        jest
          .spyOn(rolesService, 'findOne')
          .mockRejectedValue(new NotFoundException());

        const result = rolesController.findOne(1);

        await expect(rolesService.findOne).rejects.toThrow(NotFoundException);
        await expect(result).rejects.toThrow(NotFoundException);
      });
    });

    describe('update role', () => {
      it('should throw error if role not found', async () => {
        const role = {
          id: 1,
          name: 'New role',
          description: 'New description',
        };

        jest
          .spyOn(rolesService, 'update')
          .mockRejectedValue(new NotFoundException());

        const result = rolesController.update(role.id, role);

        await expect(rolesService.update).rejects.toThrow(NotFoundException);
        await expect(result).rejects.toThrow(NotFoundException);
      });

      it('should update role', async () => {
        const role = {
          id: 1,
          name: 'New role',
          description: 'New description',
        };

        const mockUpdateResponse: Role = {
          id: 1,
          name: 'New role',
          description: 'New description',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        jest
          .spyOn(rolesService, 'update')
          .mockResolvedValue(mockUpdateResponse);

        const result = await rolesController.update(role.id, role);

        expect(rolesService.update).toHaveBeenCalledWith(role.id, role);
        expect(result).toEqual(mockUpdateResponse);
      });
    });

    describe('remove role', () => {
      it('should throw error if role not found', async () => {
        jest
          .spyOn(rolesService, 'remove')
          .mockRejectedValue(new NotFoundException());

        const result = rolesController.remove(1);

        await expect(rolesService.remove).rejects.toThrow(NotFoundException);
        await expect(result).rejects.toThrow(NotFoundException);
      });

      it('should return a role when success deleted', async () => {
        const role = {
          id: 1,
          name: 'New role',
          description: 'New description',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        jest
          .spyOn(rolesService, 'remove')
          .mockResolvedValue(role);

        const result = await rolesController.remove(role.id);

        expect(rolesService.remove).toHaveBeenCalledWith(role.id);
        expect(result).toEqual(role);
      });
    });
  });
});