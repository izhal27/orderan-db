import { join } from 'path';
import * as fs from 'fs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { UserEntity } from './entities/user.entity';
import { compareValue, hashValue } from '../helpers/hash';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger();

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: Prisma.UserCreateInput,
    file: Express.Multer.File | null,
  ): Promise<User> {
    if (file) {
      data.image = file.filename;
    }
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
        },
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
      throw new NotFoundException(`User "${where.username}" not found`);
    }
    return this.sanitizeUser(user);
  }

  async getCurrentUserData(
    id: number,
    currentUserId: number,
  ): Promise<User | null> {
    // only current user can get profile
    if (id !== currentUserId) {
      throw new ForbiddenException('403 Forbidden');
    }
    return this.findUnique({ id });
  }

  async update(
    params: {
      where: Prisma.UserWhereUniqueInput;
      data: Prisma.UserUpdateInput;
    },
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<User> {
    const { where, data } = params;
    const currentUser = await this.findUnique(where);
    if (data.password) {
      data.password = await hashValue(data.password.toString());
    } else {
      // hapus value undefined, string empty atau null dari client
      delete data.password;
    }
    if (file) {
      this.removeImage(currentUser?.image!);
      data.image = file.filename;
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

  async updateProfile(
    params: {
      where: Prisma.UserWhereUniqueInput;
    },
    currentId: number,
    updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<User> {
    const { where } = params;
    // only current user can update profile
    if (where.id !== currentId) {
      throw new ForbiddenException('403 Forbidden');
    }
    const { currentPassword, newPassword, ...data } = updateUserDto;
    const currentUser = await this.findUnique(where);
    if (file) {
      this.removeImage(currentUser?.image!);
      updateUserDto.image = file.filename;
    }
    // jika password baru dikirim tersedia, hash password baru
    if (newPassword) {
      // cek password lama
      const isMatch = await compareValue(
        currentPassword,
        currentUser!.password,
      );
      if (!isMatch) {
        throw new BadRequestException('Password lama tidak cocok');
      }
      data.password = await hashValue(newPassword.toString());
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
    const currentUser = await this.findUnique(where);
    const user = await this.prismaService.user.delete({
      where: { id: currentUser!.id },
    });
    this.removeImage(currentUser?.image!);
    return this.sanitizeUser(user);
  }

  sanitizeUser(user: User) {
    // remove passsword field from user
    return new UserEntity(user);
  }

  removeImage(imagePath: string) {
    if (!imagePath) {
      return;
    }
    const oldImagePath = join(__dirname, '../../public/images', imagePath);
    if (fs.existsSync(oldImagePath)) {
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error('Error deleting old image:', err);
        }
      });
    }
  }
}
