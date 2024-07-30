import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { RolesService } from './roles.service';

describe('RolesService', () => {
  let service: RolesService;
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

    service = module.get<RolesService>(RolesService);
  });

  it('should have the service defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should be defined', () => {
      expect(service.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      service.findMany();
      expect(prismaMock.role.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUnique', () => {
    it('should be defined', () => {
      expect(service.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.role.findUnique.mockResolvedValue({} as Role);
      service.findUnique({ id: 1 });
      expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await service.create({} as Role);
      expect(prismaMock.role.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });

    it('should call the prisma service', () => {
      service.update({ where: { id: 1 }, data: {} as Role });
      expect(prismaMock.role.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(service.delete).toBeDefined();
    });

    it('should call the prisma service', () => {
      service.delete({ id: 1 });
      expect(prismaMock.role.delete).toHaveBeenCalledTimes(1);
    });
  });
});
