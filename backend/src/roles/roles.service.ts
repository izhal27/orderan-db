import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class RolesService {
  private readonly logger = new Logger();

  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.RoleCreateInput): Promise<Role> {
    try {
      return this.prismaService.role.create({ data });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  findMany(): Promise<Role[]> {
    try {
      return this.prismaService.role.findMany();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
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
    try {
      const { where, data } = params;
      return this.prismaService.role.update({
        where,
        data,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  delete(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
    try {
      return this.prismaService.role.delete({
        where,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
