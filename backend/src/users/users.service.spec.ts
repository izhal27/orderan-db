import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { UsersService } from "./users.service";

const user = {
  id: 1,
  username: 'testing',
  email: 'test@test.com',
  password: 'aaa',
  name: 'Testing User',
  image: '',
  isBlocked: false,
  roleId: 1,
  refreshToken: '',
  createdAt: new Date(),
  updatedAt: new Date()
}

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

  describe('create', () => {
    it('should return created user', async () => {

      prismaMock.user.create.mockResolvedValue(user);

      const result = await usersService.create(user);
      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return all user', async () => {
      const allUsers = [
        user, user
      ];

      prismaMock.user.findMany.mockResolvedValue(allUsers);

      const result = await usersService.findAll();
      expect(result).toEqual(allUsers);
    });

    it('should return empty array if there are no roles', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);

      const result = await usersService.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return user if exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await usersService.findOne(user.id);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        usersService.findOne(1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return updated user', async () => {
      prismaMock.user.update.mockResolvedValue(user);

      const result = await usersService.update(1, user);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not exists', async () => {
      prismaMock.user.update.mockRejectedValue(new NotFoundException());

      await expect(
        usersService.update(1, user),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should return delete user', async () => {
      prismaMock.user.delete.mockResolvedValue(user);

      const result = await usersService.remove(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not exists', async () => {
      prismaMock.user.delete.mockRejectedValue(new NotFoundException());

      await expect(
        usersService.remove(1),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
