import { ApiProperty } from '@nestjs/swagger';
import { OrderDetail } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
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
  @ApiProperty({
    example: new Date(),
    description: 'Order date',
  })
  date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'John Doe',
    description: 'Customer name',
  })
  customer: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  @ApiProperty({
    required: false,
    example: 'Etiam iaculis nunc ac metus',
    description: 'Order description',
  })
  description: string | null;

  @Exclude()
  updatedById: number | null;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({
    each: true,
    message: 'Order detail is missing',
  })
  @IsNotEmpty()
  @Type(() => CreateOrderDetailDto)
  @ApiProperty({
    example: [
      {
        name: 'FLEXY BANNER 280 GSM',
        price: 24000,
        width: 200,
        height: 100,
        qty: 2,
        design: 1,
        description: 'Id sint vel ipsam quis. Incidunt laudantium tenetur.',
      },
      {
        name: 'FLEXY BANNER 280 GSM',
        price: 24000,
        width: 500,
        height: 300,
        qty: 3,
        design: 1,
        description:
          'Non perferendis commodi eos ad voluptatum nemo necessitatibus porro non. Veniam sed deserunt. Id hic aut nam.',
      },
      {
        name: 'KINGSTRUK 230 GSM',
        price: 8500,
        width: 32,
        height: 48,
        qty: 10,
        design: 2,
        description:
          'Voluptate et vel iure repudiandae ipsa explicabo aperiam autem alias. Nam amet autem qui dolores ullam. Earum dolor a.',
      },
    ],
  })
  orderDetails: OrderDetail[];
}
