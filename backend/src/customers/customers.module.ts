import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
