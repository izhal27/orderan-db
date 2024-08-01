import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "@prisma/client";

export class CustomerEntity implements Customer {
  @ApiProperty({ required: false })
  id: string;

  @ApiProperty({ example: "John Doe", description: "Customer name" })
  name: string;

  @ApiProperty({ required: false, example: "27th Street", description: "Customer address" })
  address: string | null;

  @ApiProperty({ required: false })
  contact: string | null;

  @ApiProperty({ required: false })
  email: string | null;

  @ApiProperty({ required: false })
  description: string | null;

  @ApiProperty({ required: false })
  createdById: number | null;

  @ApiProperty({ required: false })
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt: Date;
}
