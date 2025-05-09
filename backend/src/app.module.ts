import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';

import { validate } from './config/env.config';
import { AccessTokenGuard, RolesGuard } from './common/guards';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { OrderTypesModule } from './order-types/order-types.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
      validate,
    }),
    PrismaModule.forRoot({}),
    RolesModule,
    UsersModule,
    AuthModule,
    OrderTypesModule,
    OrdersModule,
    CustomersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
