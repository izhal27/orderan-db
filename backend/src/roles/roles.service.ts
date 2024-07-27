import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.RoleCreateInput): Promise<Role> {
    return this.prismaService.role.create({ data });
  }

  findMany(): Promise<Role[]> {
    return this.prismaService.role.findMany();
  }

  async findUnique(where: Prisma.RoleWhereUniqueInput): Promise<Role | null> {
    const article = await this.prismaService.role.findUnique({
      where,
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  update(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUpdateInput;
  }): Promise<Role> {
    const { where, data } = params;
    return this.prismaService.role.update({
      where,
      data,
    });
  }

  delete(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
    return this.prismaService.role.delete({
      where,
    });
  }
}
