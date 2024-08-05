import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";

export class MarkPayDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: 'true or false',
    description: 'Status pay',
  })
  status: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-08-05T05:41:49.371Z',
    description: 'Pay date',
  })
  payAt: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'Description pay',
    description: 'Pay status description',
  })
  description: string;
}