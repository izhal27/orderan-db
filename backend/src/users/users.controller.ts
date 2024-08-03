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
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Roles } from '../common/decorators';
import { Role } from '../common';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(Role.Admin, Role.Administrasi)
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Administrasi)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findMany();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Administrasi, Role.Designer, Role.Operator)
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUnique({ id });
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Administrasi, Role.Designer, Role.Operator)
  @ApiOkResponse({ type: UserEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update({ where: { id }, data: updateUserDto });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOkResponse({ type: UserEntity })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete({ id });
  }
}
