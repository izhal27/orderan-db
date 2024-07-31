import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDetailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ default: 0 })
  price: Decimal;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  width: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  height: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  qty: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  design: number;

  @IsNotEmpty()
  @ApiProperty({ required: false, default: false })
  eyelets: boolean;

  @IsNotEmpty()
  @ApiProperty({ required: false, default: false })
  shiming: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  orderId: string;
}
