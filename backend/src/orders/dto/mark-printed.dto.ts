import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MarkPrintedDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: 'true or false',
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
