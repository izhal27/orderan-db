import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CustomersModule } from '../customers/customers.module';
import { WebSocketService } from '../lib/websocket.service';

@Module({
  imports: [PrismaModule, CustomersModule],
  controllers: [OrdersController],
  providers: [OrdersService, WebSocketService],
})
export class OrdersModule { }
