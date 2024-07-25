import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

import { RoleEntity } from '../../roles/entities/role.entity';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ required: false })
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty({ required: false, nullable: true })
  email: string | null;

  @Exclude()
  password: string;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;

  @ApiProperty({ required: false, nullable: true })
  image: string | null;

  @ApiProperty({ required: false, default: false })
  isBlocked: boolean;

  @ApiProperty({ required: false, nullable: true })
  roleId: number | null;

  @ApiProperty({ required: false, type: RoleEntity })
  role?: RoleEntity;

  @ApiProperty({ required: false, nullable: true })
  refreshToken: string | null;

  @ApiProperty({ required: false })
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt: Date;
}
