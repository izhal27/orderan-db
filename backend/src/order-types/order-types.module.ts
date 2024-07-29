import { Module } from '@nestjs/common';
import { OrderTypesService } from './order-types.service';
import { OrderTypesController } from './order-types.controller';

@Module({
  controllers: [OrderTypesController],
  providers: [OrderTypesService],
})
export class OrderTypeModule {}
