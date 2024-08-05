import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";

export class MarkTakenDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: 'true or false',
    description: 'Status taken',
  })
  status: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-08-05T05:41:49.371Z',
    description: 'Taken date',
  })
  takenAt: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'Description taken',
    description: 'Taken status description',
  })
  description: string;
}