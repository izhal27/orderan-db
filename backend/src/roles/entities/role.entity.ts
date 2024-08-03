import { ApiExcludeController, ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RoleEntity implements Role {
  @ApiProperty({
    required: false,
    example: 1,
    description: 'Role id',
  })
  id: number;

  @ApiProperty({
    example: 'Admin',
    description: 'Role name',
  })
  name: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Role for admin',
    description: 'Role description',
  })
  description: string;

  @ApiProperty({
    required: false,
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    required: false,
    example: new Date().toISOString(),
  })
  updatedAt: Date;
}
