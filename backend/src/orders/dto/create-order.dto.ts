import { ApiProperty } from '@nestjs/swagger';
import { OrderDetail } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDetailDto } from './create-order-detail.dto';

export class CreateOrderDto {
  @Exclude()
  number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  customer: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  @ApiProperty({ required: false })
  description: string | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  updatedById: number | null;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({
    each: true,
    message: 'Order detail is missing',
  })
  @IsNotEmpty()
  @Type(() => CreateOrderDetailDto)
  @ApiProperty()
  orderDetails: OrderDetail[];
}
