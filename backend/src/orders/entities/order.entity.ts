import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderDetail } from '@prisma/client';

export class OrderEntity implements Order {
  @ApiProperty()
  id: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  customer: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  userId: number;

  @ApiProperty({ required: false, nullable: true })
  updatedById: number | null;

  @ApiProperty({ isArray: true })
  orderDetails: OrderDetail[]

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
