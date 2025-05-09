import { HttpAdapterHost } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import { AppModule } from '../../src/app.module';

export const buildApp = async (
  module: any[] = [],
): Promise<{
  app: INestApplication;
  prismaClient: PrismaClient;
}> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, PrismaClient, ...module],
  }).compile();
  const app = moduleFixture.createNestApplication();
  const prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  await app.init();
  return { app, prismaClient };
};
