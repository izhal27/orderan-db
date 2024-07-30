import { ApiProperty } from "@nestjs/swagger";
import { OrderDetail } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class OrderDetailEntity implements OrderDetail {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ default: 0 })
  price: Decimal;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  qty: number;

  @ApiProperty()
  design: number;

  @ApiProperty()
  eyelets: boolean;

  @ApiProperty()
  shiming: boolean;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}