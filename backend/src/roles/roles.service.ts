import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createRoleDto: CreateRoleDto) {
    return this.prismaService.role.create({ data: createRoleDto });
  }

  findAll() {
    return this.prismaService.role.findMany();
  }

  async findOne(id: number) {
    const article = await this.prismaService.role.findUnique({
      where: { id }
    });
    if (!article) {
      throw new NotFoundException(`Role with id ${id} does not exist.`);
    }
    return article;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.prismaService.role.update({
      where: { id },
      data: updateRoleDto
    });
  }

  remove(id: number) {
    return this.prismaService.role.delete({
      where: { id }
    });
  }
}
