import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty({ required: false })
  description: string | null;
}
