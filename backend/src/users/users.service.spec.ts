import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should have the service defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should be defined', () => {
      expect(service.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      service.findMany();
      expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(service.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.user.findUnique.mockResolvedValue({} as User);
      service.findUnique({ id: 1 });
      expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await service.create({ password: '' } as User, null);
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await service.update({ where: { id: 1 }, data: {} as User }, null);
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(service.delete).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await service.delete({ id: 1 });
      expect(prismaMock.user.delete).toHaveBeenCalledTimes(1);
    });
  });
});
