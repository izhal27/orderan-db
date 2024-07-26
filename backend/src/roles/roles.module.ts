import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
