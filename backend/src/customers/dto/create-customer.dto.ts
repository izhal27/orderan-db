import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  address: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  contact: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  email: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description: string | null;

  @Exclude()
  createdById: number | null;
}
