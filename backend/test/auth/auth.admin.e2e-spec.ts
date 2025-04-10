import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../utils/setup.e2e';
import { login } from './utils';

describe('Admin Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let accessToken: string;

  beforeAll(async () => {
    ({ app, prismaClient: prisma } = await buildApp());
    ({ accessToken } = await login(app, 'admin', '12345'));
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('GET /users - should return 200 for admin', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
