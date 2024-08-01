import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
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
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiProperty({ required: false, nullable: true })
  email?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  @ApiProperty({ required: false, nullable: true })
  name?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  image?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  blocked?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  roleId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  refreshToken?: string | null;
}
