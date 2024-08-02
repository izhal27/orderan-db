import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @IsAlphanumeric()
  @ApiProperty({
    example: 'johndoe',
    description: 'Alphanumeric only  [A–Z,a–z,0–9]',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    example: 'secret',
    description: 'Minimal length 3',
  })
  password: string;
}
