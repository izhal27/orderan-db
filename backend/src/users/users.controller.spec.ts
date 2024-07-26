import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

const user = {
  id: 1,
  username: 'testing',
  email: 'test@test.com',
  password: 'aaa',
  name: 'Testing User',
  image: '',
  blocked: false,
  roleId: 1,
  refreshToken: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('users controller', () => {
    describe('create user', () => {
      it('should register new user', async () => {
        jest.spyOn(usersService, 'create').mockResolvedValue(user);

        const result = await usersController.create(user);

        expect(usersService.create).toHaveBeenCalledWith(user);
        expect(result).toEqual(user);
      });

      it('should throw error if name already registered', async () => {
        jest
          .spyOn(usersService, 'create')
          .mockRejectedValue(new ConflictException());

        const register = usersController.create(user);

        await expect(usersService.create).rejects.toThrow(ConflictException);
        await expect(register).rejects.toThrow(ConflictException);
      });

      it('should throw error if required fields is missing', async () => {
        jest
          .spyOn(usersService, 'create')
          .mockRejectedValue(new BadRequestException());

        const register = usersController.create(new CreateUserDto());

        await expect(usersService.create).rejects.toThrow(BadRequestException);
        await expect(register).rejects.toThrow(BadRequestException);
      });
    });

    describe('get user', () => {
      it('should return a user', async () => {
        jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

        const result = await usersController.findOne(user.id);

        expect(usersService.findOne).toHaveBeenCalledWith({ id: user.id });
        expect(result).toEqual(user);
      });

      it('should throw error if user not found', async () => {
        jest
          .spyOn(usersService, 'findOne')
          .mockRejectedValue(new NotFoundException());

        const result = usersController.findOne(user.id);

        await expect(usersService.findOne).rejects.toThrow(NotFoundException);
        await expect(result).rejects.toThrow(NotFoundException);
      });
    });

    describe('update user', () => {
      it('should throw error if user not found', async () => {
        jest
          .spyOn(usersService, 'update')
          .mockRejectedValue(new NotFoundException());

        const result = usersController.update(user.id, user);

        await expect(usersService.update).rejects.toThrow(NotFoundException);
        await expect(result).rejects.toThrow(NotFoundException);
      });

      it('should update user', async () => {
        jest.spyOn(usersService, 'update').mockResolvedValue(user);

        const result = await usersController.update(user.id, user);

        expect(usersService.update).toHaveBeenCalledWith({
          where: { id: user.id },
          data: user,
        });
        expect(result).toEqual(user);
      });
    });

    describe('remove user', () => {
      it('should throw error if user not found', async () => {
        jest
          .spyOn(usersService, 'remove')
          .mockRejectedValue(new NotFoundException());

        const result = usersController.remove(user.id);

        await expect(usersService.remove).rejects.toThrow(NotFoundException);
        await expect(result).rejects.toThrow(NotFoundException);
      });

      it('should return a user when success deleted', async () => {
        jest.spyOn(usersService, 'remove').mockResolvedValue(user);

        const result = await usersController.remove(user.id);

        expect(usersService.remove).toHaveBeenCalledWith({ id: user.id });
        expect(result).toEqual(user);
      });
    });
  });
});
