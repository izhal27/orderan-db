import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateOrderDto {
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
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  updatedBy: number | null;
}
