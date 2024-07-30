import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderDetailsModule } from '../order-details/order-details.module';

@Module({
  imports: [PrismaModule, OrderDetailsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
