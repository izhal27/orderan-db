import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';

import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { validate } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './common/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    PrismaModule.forRoot({}),
    RolesModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
