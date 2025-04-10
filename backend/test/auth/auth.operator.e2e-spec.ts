import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../utils/setup.e2e';
import { login } from './utils';

describe('Operator Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let accessToken: string;

  beforeAll(async () => {
    ({ app, prismaClient: prisma } = await buildApp());
    ({ accessToken } = await login(app, 'operator', '12345'));
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('POST /order-types - should return 403 for operator', async () => {
    await request(app.getHttpServer())
      .post('/order-types')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Test Order' })
      .expect(403);
  });
});
