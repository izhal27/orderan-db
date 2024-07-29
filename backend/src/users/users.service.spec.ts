import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
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

    usersService = module.get<UsersService>(UsersService);
  });

  it('should have the service defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findMany', () => {
    it('should be defined', () => {
      expect(usersService.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      usersService.findMany();
      expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(usersService.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      prismaMock.user.findUnique.mockResolvedValue({} as User);
      usersService.findUnique({ id: 1 });
      expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(usersService.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await usersService.create({ password: '' } as User);
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(usersService.update).toBeDefined();
    });

    it('should call the prisma service', () => {
      usersService.update({ where: { id: 1 }, data: {} as User });
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(usersService.delete).toBeDefined();
    });

    it('should call the prisma service', () => {
      usersService.delete({ id: 1 });
      expect(prismaMock.user.delete).toHaveBeenCalledTimes(1);
    });
  });
});
