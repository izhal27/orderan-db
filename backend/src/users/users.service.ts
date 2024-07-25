import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthDto } from '../auth/dto/auth.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await this.hashPassword(createUserDto.password);
    try {
      const user = await this.prismaService.user.create({
        data: createUserDto,
        include: {
          role: true
        }
      });
      return this.sanitizeUser(user);
    } catch (error) {
      console.log(error);
    }
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
    if (!user) {
      throw new NotFoundException(`User does not exist`);
    }
    return this.sanitizeUser(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
    return this.sanitizeUser(user);
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  async signupLocal({ username, password }: AuthDto) {
    console.log(username);

    const hashPassword = await this.hashPassword(password);
    const user = await this.create({
      username,
      password: hashPassword
    });
    return user;
  }

  async signinLocal({ username, password }: AuthDto) {
    const user = await this.findByUsername(username);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Username or password is incorect');
    }
    if (user.blocked || !user.role) {
      throw new UnauthorizedException('User has been blocked or does not have any roles')
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  sanitizeUser(user: User) {
    return new UserEntity(user);
  }
}