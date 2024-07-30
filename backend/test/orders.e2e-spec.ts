import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp } from './setup.e2e';

describe('OrderTypesController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let accessToken = '';

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    await prismaClient.orderType.upsert({
      where: { name: 'default' },
      update: {},
      create: {
        name: 'default',
        price: new Decimal(1000),
        description: 'Default Description',
      },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/local/signup')
      .send({ username: 'userordertype', password: '12345' })
      .expect(201);
    accessToken = await res.body.access_token;
  }, 30000);

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  // <---------------- CREATE ---------------->
  describe('Create', () => {
    it('should throw error 400 when name is missing', async () => {
      await request(app.getHttpServer())
        .post('/order-types')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it.skip('should throw error 409 when duplicate entry', async () => {
      await request(app.getHttpServer())
        .post('/order-types')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'default' })
        .expect(409);
    });

    it.skip('should create a orderType', async () => {
      const {
        fakeName,
        fakePrice,
        fakeDesc,
        body: { name, price, description },
      } = await generateDummyOrderType(app, accessToken);
      expect(name).toEqual(fakeName);
      expect(new Decimal(price)).toEqual(fakePrice);
      expect(description).toEqual(fakeDesc);
    });
  });

  // <---------------- READ ---------------->
  describe('Read', () => {
    it.skip('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .get('/order-types/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it.skip('should throw error 404 when orderType not found', async () => {
      await request(app.getHttpServer())
        .get('/order-types/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it.skip('should return list of orderType', async () => {
      const res = await request(app.getHttpServer())
        .get('/order-types')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const orderType = await res.body;
      expect(orderType).not.toBe(null);
      expect(orderType).toBeInstanceOf(Array);
    });

    it.skip('should return a orderType', async () => {
      const {
        fakeName,
        fakeDesc,
        body: { id },
      } = await generateDummyOrderType(app, accessToken);
      const res = await request(app.getHttpServer())
        .get(`/order-types/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { name, description } = await res.body;
      expect(name).toEqual(fakeName);
      expect(description).toEqual(fakeDesc);
    });
  });

  // <---------------- UPDATE ---------------->
  describe('Update', () => {
    it.skip('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .patch('/order-types/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it.skip('should throw error 400 when name is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/order-types')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: faker.string.alphanumeric({ length: 5 }),
          description: 'This is a description',
        })
        .expect(201);
      const { id } = await res.body;
      await request(app.getHttpServer())
        .patch(`/order-types/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it.skip('should throw error 404 when orderType not found', async () => {
      await request(app.getHttpServer())
        .patch('/order-types/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });

    it.skip('should return updated orderType', async () => {
      const updateRole = {
        name: 'updatedrole',
        description: faker.lorem.words(),
      };
      const {
        body: { id },
      } = await generateDummyOrderType(app, accessToken);
      const res = await request(app.getHttpServer())
        .patch(`/order-types/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateRole)
        .expect(200);
      const { name, description } = await res.body;
      expect(name).toEqual(updateRole.name);
      expect(description).toEqual(updateRole.description);
    });
  });

  // <---------------- DELETE ---------------->
  describe('Delete', () => {
    it.skip('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .delete('/order-types/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it.skip('should throw error 404 when orderType not found', async () => {
      await request(app.getHttpServer())
        .delete('/order-types/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it.skip('should return a orderType', async () => {
      const {
        fakeName,
        fakeDesc,
        body: { id },
      } = await generateDummyOrderType(app, accessToken);
      const res = await request(app.getHttpServer())
        .delete(`/order-types/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { name, description } = await res.body;
      expect(name).toEqual(fakeName);
      expect(description).toEqual(fakeDesc);
    });
  });
});

async function generateDummyOrderType(
  app: INestApplication<any>,
  accessToken: string,
) {
  const fakeName = faker.string.alphanumeric({ length: 5 });
  const fakePrice = new Decimal(5000);
  const fakeDesc = faker.lorem.words();
  const postRes = await request(app.getHttpServer())
    .post('/order-types')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ name: fakeName, price: fakePrice, description: fakeDesc })
    .expect(201);
  return { fakeName, fakePrice, fakeDesc, body: postRes.body };
}
