import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../utils/setup.e2e';

describe('Unauthenticated Access (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    ({ app, prismaClient: prisma } = await buildApp());
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it.each(['/users', '/roles', '/orders', '/customers'])(
    'GET %s - should return 401',
    async (path) => {
      await request(app.getHttpServer()).get(path).expect(401);
    },
  );
});
