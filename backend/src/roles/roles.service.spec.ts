import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { RolesService } from "./roles.service";

const role = {
  id: 1,
  name: 'role 1',
  description: 'description 1',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('RolesService', () => {
  let roleService: RolesService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    roleService = module.get<RolesService>(RolesService);
  });

  describe('create', () => {
    it('should return created role', async () => {
      prismaMock.role.create.mockResolvedValue(role);

      const result = await roleService.create(role);
      expect(result).toEqual(role);
    });
  });

  describe('findAll', () => {
    it('should return all role', async () => {
      const allRoles = [role, role];

      prismaMock.role.findMany.mockResolvedValue(allRoles);

      const result = await roleService.findAll();
      expect(result).toEqual(allRoles);
    });

    it('should return empty array if there are no roles', async () => {
      prismaMock.role.findMany.mockResolvedValue([]);

      const result = await roleService.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return role if exists', async () => {
      prismaMock.role.findUnique.mockResolvedValue(role);

      const result = await roleService.findOne(role.id);
      expect(result).toEqual(role);
    });

    it('should throw NotFoundException if role not exists', async () => {
      prismaMock.role.findUnique.mockResolvedValue(null);

      await expect(
        roleService.findOne(role.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return updated role', async () => {
      prismaMock.role.update.mockResolvedValue(role);

      const result = await roleService.update(role.id, role);
      expect(result).toEqual(role);
    });
  });

  describe('delete', () => {
    it('should return delete role', async () => {
      prismaMock.role.delete.mockResolvedValue(role);

      const result = await roleService.remove(role.id);
      expect(result).toEqual(role);
    });
  });
});