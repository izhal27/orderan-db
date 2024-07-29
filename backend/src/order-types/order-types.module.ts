import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { OrderTypesService } from './order-types.service';
import { OrderTypesController } from './order-types.controller';

@Module({
  imports: [PrismaModule],
  controllers: [OrderTypesController],
  providers: [OrderTypesService],
})
export class OrderTypesModule { }
