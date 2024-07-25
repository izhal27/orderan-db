import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { hashValue } from './../helpers/hash';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await hashValue(createUserDto.password);
    const user = await this.prismaService.user.create({
      data: createUserDto,
      include: {
        role: true
      }
    });
    return this.sanitizeUser(user);
  }

  async findAll() {
    const users = await this.prismaService.user.findMany({
      include: {
        role: true
      }
    });
    return users.map(user => this.sanitizeUser(user));
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        role: true
      },
    });
    if (!user) {
      throw new NotFoundException(`User does not exist`);
    }
    return this.sanitizeUser(user);
  }

  async findByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      include: {
        role: true
      },
    });
    if (user) {
      this.sanitizeUser(user)
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
    return this.sanitizeUser(user);
  }

  async remove(id: number) {
    const user = await this.prismaService.user.delete({
      where: { id },
    });
    return this.sanitizeUser(user);
  }

  sanitizeUser(user: User) {
    return new UserEntity(user);
  }
}