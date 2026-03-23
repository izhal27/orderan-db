import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CancelPrintedManyDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description: 'Order detail IDs to cancel printed status',
  })
  orderDetailIds: string[];
}
