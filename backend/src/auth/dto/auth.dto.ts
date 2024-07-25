import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @IsAlphanumeric()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  password: string;
}