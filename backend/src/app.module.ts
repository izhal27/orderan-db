import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';

import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { OrderTypeModule } from './order-type/order-type.module';
import { validate } from './config/env.config';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './common/guards';

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
    OrderTypeModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
