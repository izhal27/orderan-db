import { ApiProperty } from '@nestjs/swagger';
import { OrderType } from '@prisma/client';

export class OrderTypeEntity implements OrderType {
  @ApiProperty({
    required: false,
    example: 1,
    description: 'Order type id',
  })
  id: number;

  @ApiProperty({
    example: 'FLEXY BANNER 280 GSM',
    description: 'Unique order type',
  })
  name: string;

  @ApiProperty({
    required: false,
    default: 0,
    example: 27000,
    description: 'Order type price',
  })
  price: number;

  @ApiProperty({
    required: false,
    example: 'Aenean tellus metus bibendum sed',
    description: 'Order type description',
  })
  description: string | null;

  @ApiProperty({
    required: false,
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    required: false,
    example: new Date().toISOString(),
  })
  updatedAt: Date;
}
