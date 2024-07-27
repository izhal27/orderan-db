import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { UserEntity } from './entities/user.entity';
import { hashValue } from '../helpers/hash';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await hashValue(data.password);
    const user = await this.prismaService.user.create({
      data,
      include: {
        role: true,
      },
    });
    return this.sanitizeUser(user);
  }

  async findMany() {
    const users = await this.prismaService.user.findMany({
      include: {
        role: true,
      },
    });
    return users.map((user) => this.sanitizeUser(user));
  }

  async findOne(
    where: Prisma.UserWhereUniqueInput,
    includeRole = true,
  ): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where,
      include: {
        role: includeRole,
      },
    });
    if (user) {
      this.sanitizeUser(user);
    }
    return user;
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    const user = await this.prismaService.user.update({
      where,
      data,
    });
    return this.sanitizeUser(user);
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prismaService.user.delete({
      where,
    });
    return this.sanitizeUser(user);
  }

  sanitizeUser(user: User) {
    return new UserEntity(user);
  }
}
