import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { buildApp } from './setup.e2e';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
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
    let newUser;

    it('POST: /auth/local/signup - should return tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/local/signup')
        .send({
          username: faker.string.alphanumeric({ length: 5 }),
          password: faker.internet.password()
        })
        .expect(201);
      const { access_token, refresh_token } = await res.body;
      newUser = access_token;
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

    it('GET: /users - should throw 403 Forbidden', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${newUser}`)
        .expect(403);
    });

    it('GET: /roles - should throw 403 Forbidden', async () => {
      await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${newUser}`)
        .expect(403);
    });

    it('GET: /order-types - should return order types array', async () => {
      const res = await request(app.getHttpServer())
        .get('/order-types')
        .set('Authorization', `Bearer ${newUser}`)
        .expect(200);
      const orderTypes = await res.body;
      expect(orderTypes).not.toBeNull();
      expect(orderTypes).toBeInstanceOf(Array);
    });

    it('GET: /orders - should return orders array', async () => {
      const res = await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${newUser}`)
        .expect(200);
      const orders = await res.body;
      expect(orders).not.toBeNull();
      expect(orders).toBeInstanceOf(Array);
    });
  });

  // <---------------- ROLE BASED ---------------->
  describe('Role Authorization', () => {
    describe('Admin', () => {
      let adminToken;

      beforeEach(async () => {
        // signin
        const res = await request(app.getHttpServer())
          .post('/auth/local/signin')
          .send({
            username: 'admin',
            password: '12345',
          })
          .expect(200);
        const { access_token } = await res.body;
        adminToken = access_token;
      });

      it('GET: /users - should return users array', async () => {
        const res = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
        const users = await res.body;
        expect(users).not.toBeNull();
        expect(users).toBeInstanceOf(Array);
      });
    });
  });
});
