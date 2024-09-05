import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(((param) => param.value.toUpperCase()))
  @ApiProperty({
    example: 'John Doe',
    description: 'Customer name',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: '27th Street',
    description: 'Customer address',
  })
  address: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  @ApiProperty({
    required: false,
    example: '+6212345',
    description: 'Customer contact',
  })
  contact: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  @ApiProperty({
    required: false,
    example: 'customer@email.com',
    description: 'Customer email',
  })
  email: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  @ApiProperty({
    required: false,
    example: 'Donec elit libero sodales nec',
    description: 'Customer description',
  })
  description: string | null;

  @Exclude()
  createdById: number | null;
}
