import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

import { RoleEntity } from '../../roles/entities/role.entity';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    required: false,
    example: 1,
    description: 'User id'
  })
  id: number;

  @ApiProperty({
    example: 'heloise37',
    description: 'Alphanumeric only  [A–Z,a–z,0–9]'
  })
  username: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Lorenzo.Cormier42@hotmail.com',
    description: 'User email'
  })
  email: string | null;

  @Exclude()
  password: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Vera Emmerich',
    description: 'Name for user'
  })
  name: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '/image/path',
    description: 'Path for user image'
  })
  image: string | null;

  @Exclude()
  @ApiProperty({
    required: false,
    default: false,
    example: true,
    description: 'True if user has been blocked'
  })
  blocked: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 1,

  })
  roleId: number | null;

  @ApiProperty({
    required: false,
    type: RoleEntity
  })
  role?: RoleEntity;

  @Exclude()
  @ApiProperty({
    required: false,
    nullable: true,
    example: null
  })
  refreshToken: string | null;

  @ApiProperty({
    required: false,
    example: new Date().toISOString()
  })
  createdAt: Date;

  @ApiProperty({
    required: false,
    example: new Date().toISOString()
  })
  updatedAt: Date;
}
