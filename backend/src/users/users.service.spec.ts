import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
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
    beforeEach(() => {
      prismaMock.user.findMany.mockResolvedValue([]);
    });

    it('should be defined', () => {
      expect(usersService.findMany).toBeDefined();
    });

    it('should call the prisma service', () => {
      usersService.findMany();
      expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      prismaMock.user.findUnique.mockResolvedValue({} as User);
    });

    it('should be defined', () => {
      expect(usersService.findUnique).toBeDefined();
    });

    it('should call the prisma service', () => {
      usersService.findUnique({ id: 1 });
      expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      prismaMock.user.create.mockResolvedValue({} as User);
    });

    it('should be defined', () => {
      expect(usersService.create).toBeDefined();
    });

    it('should call the prisma service', async () => {
      await usersService.create({ password: '' } as User);
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      prismaMock.user.update.mockResolvedValue({} as User);
    });

    it('should be defined', () => {
      expect(usersService.update).toBeDefined();
    });

    it('should call the prisma service', () => {
      usersService.update({ where: { id: 1 }, data: {} as User });
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      prismaMock.user.delete.mockResolvedValue({} as User);
    });

    it('should be defined', () => {
      expect(usersService.delete).toBeDefined();
    });

    it('should call the prisma service', () => {
      usersService.delete({ id: 1 });
      expect(prismaMock.user.delete).toHaveBeenCalledTimes(1);
    });
  });
});
