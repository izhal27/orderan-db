import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @IsAlphanumeric()
  @ApiProperty({
    example: 'heloise37',
    description: 'Alphanumeric only  [A–Z,a–z,0–9]',
  })
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '12345',
    description: 'Minimal length 3',
  })
  password: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Lorenzo.Cormier42@hotmail.com',
    description: 'User email',
  })
  email?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Vera Emmerich',
    description: 'Name for user, Max length 50',
  })
  name?: string | null;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    required: false,
    nullable: true,
    example: '/image/path',
    description: 'Path for user image',
  })
  image?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
    example: true,
    description: 'True if user has been blocked',
  })
  blocked?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    nullable: true,
    example: 1,
  })
  roleId?: number;

  @IsString()
  @IsOptional()
  refreshToken?: string | null;
}
