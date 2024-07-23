import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

const role: Role = {
  id: 1,
  name: 'New role',
  description: 'New description',
  createdAt: new Date(),
  updatedAt: new Date()
};

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
        jest
          .spyOn(rolesService, 'create')
          .mockResolvedValue(role);

        const result = await rolesController.create(role);

        expect(rolesService.create).toHaveBeenCalledWith(role);
        expect(result).toEqual(role);
      });

      it('should throw error if name already registered', async () => {
        jest
          .spyOn(rolesService, 'create')
          .mockRejectedValue(new ConflictException());

        const register = rolesController.create(role);

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
        jest
          .spyOn(rolesService, 'findOne')
          .mockResolvedValue(role);

        const result = await rolesController.findOne(role.id);

        expect(rolesService.findOne).toHaveBeenCalledWith(role.id);
        expect(result).toEqual(role);
      });

      it('should throw error if role not found', async () => {
        jest
          .spyOn(rolesService, 'findOne')
          .mockRejectedValue(new NotFoundException());

        const result = rolesController.findOne(role.id);

        await expect(rolesService.findOne).rejects.toThrow(NotFoundException);
        await expect(result).rejects.toThrow(NotFoundException);
      });
    });

    describe('update role', () => {
      it('should throw error if role not found', async () => {
        jest
          .spyOn(rolesService, 'update')
          .mockRejectedValue(new NotFoundException());

        const result = rolesController.update(role.id, role);

        await expect(rolesService.update).rejects.toThrow(NotFoundException);
        await expect(result).rejects.toThrow(NotFoundException);
      });

      it('should update role', async () => {
        jest
          .spyOn(rolesService, 'update')
          .mockResolvedValue(role);

        const result = await rolesController.update(role.id, role);

        expect(rolesService.update).toHaveBeenCalledWith(role.id, role);
        expect(result).toEqual(role);
      });
    });

    describe('remove role', () => {
      it('should throw error if role not found', async () => {
        jest
          .spyOn(rolesService, 'remove')
          .mockRejectedValue(new NotFoundException());

        const result = rolesController.remove(role.id);

        await expect(rolesService.remove).rejects.toThrow(NotFoundException);
        await expect(result).rejects.toThrow(NotFoundException);
      });

      it('should return a role when success deleted', async () => {
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