import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrderTypeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    example: 'FLEXY BANNER 280 GSM',
    description: 'Unique order type',
  })
  name: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: 0,
    example: 27000,
    description: 'Order type price',
  })
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  @ApiProperty({
    required: false,
    example: 'Aenean tellus metus bibendum sed',
    description: 'Order type description',
  })
  description: string | null;
}
