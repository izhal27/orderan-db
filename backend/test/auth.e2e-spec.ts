import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { buildApp } from './setup.e2e';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let accessToken;
  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    const fakeRoleName = faker.string.alphanumeric({ length: 5 });
    const fakeRoleDesc = faker.lorem.words();
    await prismaClient.role.upsert({
      where: { name: fakeRoleName },
      update: {},
      create: { name: fakeRoleName, description: fakeRoleDesc },
    });
  }, 30000);

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  // <---------------- UNAUTHENTICATED ---------------->
  describe('Unauthenticated', () => {
    it('GET: /roles - should return Unauthorized', async () => {
      await request(app.getHttpServer()).get('/roles').expect(401);
    });

    it('GET: /users - should return Unauthorized', async () => {
      await request(app.getHttpServer()).get('/users').expect(401);
    });

    it('GET: /order-types - should return Unauthorized', async () => {
      await request(app.getHttpServer()).get('/orders').expect(401);
    });

    it('GET: /orders - should return Unauthorized', async () => {
      await request(app.getHttpServer()).get('/orders').expect(401);
    });
  });

  // <---------------- AUTHENTICATED ---------------->
  describe('Authenticated', () => {
    it('POST: /auth/local/signup - should return tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/local/signup')
        .send({
          username: faker.string.alphanumeric({ length: 5 }),
          password: faker.internet.password()
        })
        .expect(201);
      const { access_token, refresh_token } = await res.body;
      accessToken = access_token;
      expect(access_token).not.toBeNull();
      expect(refresh_token).not.toBeNull();
    });

    it('POST: /auth/local/signin - should return tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/local/signin')
        .send({ username: 'admin', password: '12345' })
        .expect(200);
      const { access_token, refresh_token } = await res.body;
      expect(access_token).not.toBeNull();
      expect(refresh_token).not.toBeNull();
    });

    it('GET: /roles - should return roles array', async () => {
      const res = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const roles = await res.body;
      expect(roles).not.toBeNull();
      expect(roles).toBeInstanceOf(Array);
    });

    it('GET: /users - should return users array', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const users = await res.body;
      expect(users).not.toBeNull();
      expect(users).toBeInstanceOf(Array);
    });

    it('GET: /order-types - should return order types array', async () => {
      const res = await request(app.getHttpServer())
        .get('/order-types')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const orderTypes = await res.body;
      expect(orderTypes).not.toBeNull();
      expect(orderTypes).toBeInstanceOf(Array);
    });

    it('GET: /orders - should return orders array', async () => {
      const res = await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const orders = await res.body;
      expect(orders).not.toBeNull();
      expect(orders).toBeInstanceOf(Array);
    });
  });


  // <---------------- ROLE BASED ---------------->
  describe('Authenticated', () => {
    it('GET: /Users - Only admin can access user resource', async () => {
      const username = 'admin';
      const password = '12345';
      // signin
      const res = await request(app.getHttpServer())
        .post('/auth/local/signin')
        .send({
          username: 'admin',
          password: '12345',
        })
        .expect(200);
      console.log(JSON.stringify(await res.body, null, 4))
      const { access_token, refresh_token } = await res.body;
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);
    })
  });
});
