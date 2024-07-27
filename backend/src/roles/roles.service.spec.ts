import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { RolesService } from './roles.service';

const role: Role = {
  id: 1,
  name: 'role 1',
  description: 'description 1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

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

  it('should have the service defined', () => {
    expect(roleService).toBeDefined();
  });

  describe('findMany', () => {
    beforeEach(() => {
      prismaMock.role.findMany.mockResolvedValue([]);
    });

    it('should be defined', () => {
      expect(roleService.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      roleService.findMany();
      expect(prismaMock.role.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUnique', () => {
    beforeEach(() => {
      prismaMock.role.findUnique.mockResolvedValue(role);
    });

    it('should be defined', () => {
      expect(roleService.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      roleService.findUnique({ id: 1 });
      expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      prismaMock.role.create.mockResolvedValue(role);
    });

    it('should be defined', () => {
      expect(roleService.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await roleService.create({ ...role });
      expect(prismaMock.role.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      prismaMock.role.update.mockResolvedValue(role);
    });

    it('should be defined', () => {
      expect(roleService.update).toBeDefined();
    });

    it('should call the prisma service', () => {
      roleService.update({ where: { id: 1 }, data: { ...role } });
      expect(prismaMock.role.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      prismaMock.role.delete.mockResolvedValue(role);
    });

    it('should be defined', () => {
      expect(roleService.delete).toBeDefined();
    });

    it('should call the prisma service', () => {
      roleService.delete({ id: 1 });
      expect(prismaMock.role.delete).toHaveBeenCalledTimes(1);
    });
  });
});
