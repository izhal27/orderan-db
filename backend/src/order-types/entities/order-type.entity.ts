import { ApiProperty } from '@nestjs/swagger';
import { OrderType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class OrderTypeEntity implements OrderType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, default: 0 })
  price: number;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
