import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDetailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

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

  @ApiProperty({ required: false, default: false })
  eyelets: boolean;

  @ApiProperty({ required: false, default: false })
  shiming: boolean;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  orderId: string;
}