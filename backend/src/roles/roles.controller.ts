import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExcludeController,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RoleEntity } from './entities/role.entity';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { Roles } from '../common/decorators';
import { Role } from '../common';

@Controller('roles')
@Roles(Role.Admin)
@ApiExcludeController()
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiCreatedResponse({ type: RoleEntity })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOkResponse({ type: RoleEntity, isArray: true })
  findAll() {
    return this.rolesService.findMany();
  }

  @Get(':id')
  @ApiOkResponse({ type: RoleEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findUnique({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: RoleEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update({ where: { id }, data: updateRoleDto });
  }

  @Delete(':id')
  @ApiOkResponse({ type: RoleEntity })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.delete({ id });
  }
}
