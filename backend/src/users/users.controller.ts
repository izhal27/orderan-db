import { Express } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { GetCurrentUserId, Roles } from '../common/decorators';
import { Role } from '../common';
import { multerOptions } from '../lib';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin, Role.Administrasi)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiCreatedResponse({ type: UserEntity })
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    return this.usersService.create(createUserDto, file);
  }

  @Get()
  @Roles(Role.Admin, Role.Administrasi)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findMany();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Administrasi)
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUnique({ id });
  }

  @Get('/:id/profile')
  @ApiOkResponse({ type: UserEntity })
  getProfil(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return this.usersService.getCurrentUserData(id, currentUserId);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Administrasi)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiOkResponse({ type: UserEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    return this.usersService.update(
      { where: { id }, data: updateUserDto },
      file,
    );
  }

  @Patch('/:id/profile')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiOkResponse({ type: UserEntity })
  updateProfil(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrentUserId() currentId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(
      { where: { id } },
      currentId,
      updateUserDto,
      file,
    );
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOkResponse({ type: UserEntity })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete({ id });
  }
}
