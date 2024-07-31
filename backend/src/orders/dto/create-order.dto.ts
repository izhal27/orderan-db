import { ApiProperty } from '@nestjs/swagger';
import { OrderDetail } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import * as randomstring from 'randomstring';
import { OrderDetailEntity } from 'src/order-details/entities/order-detail.entity';

export class CreateOrderDto {
  constructor() {
    this.number = 'DB-' + randomstring.generate({
      charset: 'alphanumeric',
      length: 10,
      capitalization: 'uppercase',
    })
  }
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  number: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  customer: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty({ required: false })
  description: string | null;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  updatedBy: number | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailEntity)
  @ApiProperty()
  orderDetails: OrderDetailEntity[]
}
