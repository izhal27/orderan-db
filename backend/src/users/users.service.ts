import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { UserEntity } from './entities/user.entity';
import { hashValue } from '../helpers/hash';

@Injectable()
export class UsersService {
  private readonly logger = new Logger();

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

  async findMany(): Promise<User[]> {
    try {
      const users = await this.prismaService.user.findMany({
        include: {
          role: true,
        },
        orderBy: {
          username: 'asc',
        }
      });
      return users.map((user) => this.sanitizeUser(user));
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findUnique(
    where: Prisma.UserWhereUniqueInput,
    includeRole = true,
  ): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where,
      include: {
        role: includeRole,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sanitizeUser(user);
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    if (data.password) {
      data.password = await hashValue(data.password.toString());
    } else {
      // hapus value undefined, string empty atau null dari client
      delete data.password;
    }
    const user = await this.prismaService.user.update({
      where,
      data,
      include: {
        role: true,
      },
    });
    return this.sanitizeUser(user);
  }

  async updateProfile(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    if (data.password) {
      data.password = await hashValue(data.password.toString());
    } else {
      // hapus value undefined, string empty atau null dari client
      delete data.password;
    }
    const user = await this.prismaService.user.update({
      where,
      data,
      include: {
        role: true,
      },
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
    // remove passsword field from user
    return new UserEntity(user);
  }
}
