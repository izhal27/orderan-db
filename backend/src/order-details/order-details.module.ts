import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { OrderDetailsService } from './order-details.service';

@Module({
  imports: [PrismaModule],
  providers: [OrderDetailsService],
  exports: [OrderDetailsService]
})
export class OrderDetailsModule { }
