import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
  ArrayNotEmpty,
} from 'class-validator';

export class MarkPrintedManyDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description: 'Order detail IDs to mark as printed',
  })
  orderDetailIds: string[];

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Status printed',
  })
  status: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-08-05T05:41:49.371Z',
    description: 'Printed date',
  })
  printAt: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'Description printed',
    description: 'Printed status description',
  })
  description: string | null;
}
