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
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ required: false, nullable: true })
  name?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ required: false, nullable: true })
  image?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isBlocked?: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  roleId: number;

  @ApiProperty({ required: false, nullable: true })
  refreshToken?: string | null;
}
