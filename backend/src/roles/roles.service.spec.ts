import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { RolesService } from './roles.service';

describe('RolesService', () => {
  let roleService: RolesService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
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

  it('should have the service defined', () => {
    expect(roleService).toBeDefined();
  });

  describe('findMany', () => {
    it('should be defined', () => {
      expect(roleService.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      roleService.findMany();
      expect(prismaMock.role.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUnique', () => {
    it('should be defined', () => {
      expect(roleService.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.role.findUnique.mockResolvedValue({} as Role);
      roleService.findUnique({ id: 1 });
      expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(roleService.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await roleService.create({} as Role);
      expect(prismaMock.role.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(roleService.update).toBeDefined();
    });

    it('should call the prisma service', () => {
      roleService.update({ where: { id: 1 }, data: {} as Role });
      expect(prismaMock.role.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(roleService.delete).toBeDefined();
    });

    it('should call the prisma service', () => {
      roleService.delete({ id: 1 });
      expect(prismaMock.role.delete).toHaveBeenCalledTimes(1);
    });
  });
});
