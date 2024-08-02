import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderDetail } from '@prisma/client';

export class OrderEntity implements Order {
  @ApiProperty({
    required: false,
    example: 'c6fc2735-9201-4329-b0a8-a0dad329ed1f',
    description: 'Order id'
  })
  id: string;

  @ApiProperty({
    required: false,
    example: 'DB-240802ABCD',
    description: 'Order number'
  })
  number: string;

  @ApiProperty({
    example: new Date(),
    description: 'Order date'
  })
  date: Date;

  @ApiProperty({
    example: 'Vickie Williamson',
    description: 'Customer name'
  })
  customer: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Est porro dolores excepturi quo',
    description: 'Order description'
  })
  description: string | null;

  @ApiProperty({
    example: 1,
    description: 'Current user id'
  })
  userId: number | null;

  @ApiProperty({
    required: false, nullable: true,
    example: 1,
    description: 'Current user id'
  })
  updatedById: number | null;

  @ApiProperty({
    isArray: true,
    example: [
      {
        name: "FLEXY BANNER 280 GSM",
        price: 24000,
        width: 200,
        height: 100,
        qty: 2,
        design: 1,
        description: "Id sint vel ipsam quis. Incidunt laudantium tenetur."
      },
      {
        name: "FLEXY BANNER 280 GSM",
        price: 24000,
        width: 500,
        height: 300,
        qty: 3,
        design: 1,
        description: "Non perferendis commodi eos ad voluptatum nemo necessitatibus porro non. Veniam sed deserunt. Id hic aut nam."
      },
      {
        name: "KINGSTRUK 230 GSM",
        price: 8500,
        width: 32,
        height: 48,
        qty: 10,
        design: 2,
        description: "Voluptate et vel iure repudiandae ipsa explicabo aperiam autem alias. Nam amet autem qui dolores ullam. Earum dolor a."
      }
    ]
  })
  orderDetails: OrderDetail[] | null;

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
