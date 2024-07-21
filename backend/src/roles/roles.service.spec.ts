import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { RolesService } from "./roles.service";

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
      const role = {
        id: 1,
        name: 'role 1',
        description: 'description 1',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      prismaMock.role.create.mockResolvedValue(role);

      const result = await roleService.create(role);
      expect(result).toEqual(role);
    });
  });

  describe('findAll', () => {
    it('should return all role', async () => {
      const allRoles = [
        {
          id: 1,
          name: 'role 1',
          description: 'description 1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'role 2',
          description: 'description 2',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];

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
      const existingUser = {
        id: 1,
        name: 'Existing Role',
        description: 'Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.role.findUnique.mockResolvedValue(existingUser);

      const result = await roleService.findOne(existingUser.id);
      expect(result).toEqual(existingUser);
    });

    it('should throw NotFoundException if role not exists', async () => {
      prismaMock.role.findUnique.mockResolvedValue(null);

      await expect(
        roleService.findOne(100),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return updated role', async () => {
      const role = {
        id: 1,
        name: 'role 1',
        description: 'description 1',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      prismaMock.role.update.mockResolvedValue(role);

      const result = await roleService.update(1, role);
      expect(result).toEqual(role);
    });
  });


  describe('delete', () => {
    it('should return delete role', async () => {
      const role = {
        id: 1,
        name: 'role 1',
        description: 'description 1',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      prismaMock.role.update.mockResolvedValue(role);

      const result = await roleService.update(1, role);
      expect(result).toEqual(role);
    });
  });

});