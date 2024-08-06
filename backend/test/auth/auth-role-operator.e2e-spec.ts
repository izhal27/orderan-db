import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';

import { buildApp } from '../setup.e2e';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let operatorToken;

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    const res = await request(app.getHttpServer())
      .post('/auth/local/signin')
      .send({
        username: 'operator',
        password: '12345',
      })
      .expect(200);
    const { access_token } = await res.body;
    operatorToken = access_token;
  }, 3000);

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 3000);

  // <---------------- ROLE BASED ---------------->

  describe('Role Authorization', () => {
    it('POST: /order-types - should throw 403 Forbidden', async () => {
      const res = await request(app.getHttpServer())
        .post('/order-types')
        .set('Authorization', `Bearer ${operatorToken}`)
        .send({ name: 'order type operator' })
        .expect(403);
    });
  });

  // <-------------- END ROLE BASED -------------->
});
