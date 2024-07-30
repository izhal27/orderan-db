import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { OrderDetailsService } from './order-details.service';

@Module({
  imports: [PrismaModule],
  providers: [OrderDetailsService],
})
export class OrderDetailsModule {}
