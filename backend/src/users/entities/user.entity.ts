import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

import { RoleEntity } from '../../roles/entities/role.entity';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;

  @ApiProperty({ required: false, nullable: true })
  image: string | null;

  @ApiProperty()
  isBlocked: boolean;

  @ApiProperty()
  roleId: number;

  @ApiProperty({ required: false, type: RoleEntity })
  role?: RoleEntity;

  @ApiProperty({ required: false, nullable: true })
  refreshToken: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
