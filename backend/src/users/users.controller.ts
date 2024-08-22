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
import { join } from 'path';
import fs from 'fs';

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
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(Role.Admin, Role.Administrasi)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiCreatedResponse({ type: UserEntity })
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      createUserDto.image = file.filename;
    }
    return this.usersService.create(createUserDto);
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
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrentUserId() currentId: number
  ) {
    // only current user can get profile
    if (id !== currentId) {
      throw new ForbiddenException('403 Forbidden');
    }
    return this.usersService.findUnique({ id });
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Administrasi)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const currentUser = await this.usersService.findUnique({ id });
    if (file) {
      if (currentUser?.image) {
        const oldImagePath = join(__dirname, '../../public/images', currentUser.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Error deleting old image:', err);
          }
        });
      }
      updateUserDto.image = file.filename;
    }
    return this.usersService.update({ where: { id }, data: updateUserDto });
  }

  @Patch('/:id/profile')
  @ApiOkResponse({ type: UserEntity })
  updateProfil(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrentUserId() currentId: number
  ) {
    // only current user can update profile
    if (id !== currentId) {
      throw new ForbiddenException('403 Forbidden');
    }
    return this.usersService.update({ where: { id }, data: updateUserDto });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOkResponse({ type: UserEntity })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete({ id });
  }
}
