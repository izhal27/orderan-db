import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { buildApp } from './utils/setup.e2e';

const login = async (
  app: INestApplication,
  username: string,
  password: string,
): Promise<{ accessToken: string }> => {
  const res = await request(app.getHttpServer())
    .post('/auth/local/signin')
    .send({ username, password })
    .expect(200);
  return { accessToken: res.body.access_token };
};

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
