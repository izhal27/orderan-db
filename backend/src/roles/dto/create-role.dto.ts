import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @IsAlphanumeric()
  @ApiProperty({
    example: "Admin",
    description: "Role name"
  })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  @ApiProperty({
    required: false,
    example: "Role for admin",
    description: "Role description"
  })
  description: string | null;
}
