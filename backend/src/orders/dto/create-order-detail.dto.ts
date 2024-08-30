import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDetailDto {
  @IsString()
  @IsOptional()
  id: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'FLEXY BANNER 280 GSM',
    description: 'Order detail name',
  })
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: false,
    default: 0,
    example: 27000,
    description: 'Order type price',
  })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    default: 0,
    example: 200,
    description: 'Order type width',
  })
  width: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    default: 0,
    example: 200,
    description: 'Order type height',
  })
  height: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    default: 0,
    example: 200,
    description: 'Order type qty',
  })
  qty: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    default: 0,
    example: 200,
    description: 'Order type design',
  })
  design: number;

  @IsNotEmpty()
  @ApiProperty({
    required: false,
    default: false,
    example: true,
    description: 'True if eyelets',
  })
  eyelets: boolean;

  @IsNotEmpty()
  @ApiProperty({
    required: false,
    default: false,
    example: true,
    description: 'True if shiming',
  })
  shiming: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
    nullable: true,
    example: 'Fusce egestas elit eget lorem',
    description: 'Order detail description',
  })
  description: string | null;

  @ApiProperty({
    example: 'ad1a17e7-efd9-4b5b-a70f-38e804be9740',
    description: 'Order ID',
  })
  orderId: string;

  @IsBoolean()
  @IsOptional()
  deleted: boolean;
}
