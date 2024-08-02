import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "@prisma/client";

export class CustomerEntity implements Customer {
  @ApiProperty({
    required: false,
    example: '925dd154-3e78-4fba-b3c9-ace2504f31e9',
    description: 'Customer id'
  })
  id: string;

  @ApiProperty({
    example: "John Doe",
    description: "Customer name"
  })
  name: string;

  @ApiProperty({
    required: false,
    example: "27th Street",
    description: "Customer address"
  })
  address: string | null;

  @ApiProperty({
    required: false,
    example: "+6212345",
    description: "Customer contact"
  })
  contact: string | null;

  @ApiProperty({
    required: false,
    example: "customer@email.com",
    description: "Customer email"
  })
  email: string | null;

  @ApiProperty({
    required: false,
    example: "Donec elit libero sodales nec",
    description: "Customer description"
  })
  description: string | null;

  @ApiProperty({
    required: false,
    example: 1,
    description: "Current user id"
  })
  createdById: number | null;

  @ApiProperty({
    required: false,
    example: new Date().toISOString()
  })
  createdAt: Date;

  @ApiProperty({
    required: false,
    example: new Date().toISOString()
  })
  updatedAt: Date;
}
