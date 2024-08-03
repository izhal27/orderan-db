import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp } from './setup.e2e';

jest.setTimeout(70 * 1000);

describe('OrderTypesController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  const url = '/order-types';
  let accessToken = '';

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    await prismaClient.orderType.upsert({
      where: { name: 'Order Type default' },
      update: {},
      create: {
        name: 'Order Type default',
        price: 1000,
        description: 'Order Type default Description',
      },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/local/signin')
      .send({ username: 'admin', password: '12345' })
      .expect(200);
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
        .post(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should throw error 409 when duplicate entry', async () => {
      await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Order Type default' })
        .expect(409);
    });

    it('should create a orderType', async () => {
      const {
        fakeName,
        fakePrice,
        fakeDesc,
        body: { name, price, description },
      } = await generateDummyOrderType();
      expect(name).toEqual(fakeName);
      expect(price).toEqual(fakePrice);
      expect(description).toEqual(fakeDesc);
    });
  });

  // <---------------- READ ---------------->
  describe('Read', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .get(`${url}/a`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 404 when orderType not found', async () => {
      await request(app.getHttpServer())
        .get(`${url}/1000`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return list of orderType', async () => {
      const res = await request(app.getHttpServer())
        .get(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const orderType = await res.body;
      expect(orderType).not.toBe(null);
      expect(orderType).toBeInstanceOf(Array);
    });

    it('should return a orderType', async () => {
      const {
        fakeName,
        fakeDesc,
        body: { id },
      } = await generateDummyOrderType();
      const res = await request(app.getHttpServer())
        .get(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { name, description } = await res.body;
      expect(name).toEqual(fakeName);
      expect(description).toEqual(fakeDesc);
    });
  });

  // <---------------- UPDATE ---------------->
  describe('Update', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .patch(`${url}/a`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 400 when name is missing', async () => {
      const res = await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: faker.string.alphanumeric({ length: 5 }),
          description: 'This is a description',
        })
        .expect(201);
      const { id } = await res.body;
      await request(app.getHttpServer())
        .patch(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should throw error 404 when orderType not found', async () => {
      await request(app.getHttpServer())
        .patch(`${url}/1000`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });

    it('should return updated orderType', async () => {
      const updateRole = {
        name: 'updatedrole',
        description: faker.lorem.words(),
      };
      const {
        body: { id },
      } = await generateDummyOrderType();
      const res = await request(app.getHttpServer())
        .patch(`${url}/${id}`)
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
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .delete(`${url}/a`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 404 when orderType not found', async () => {
      await request(app.getHttpServer())
        .delete(`${url}/1000`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return a orderType', async () => {
      const {
        fakeName,
        fakeDesc,
        body: { id },
      } = await generateDummyOrderType();
      const res = await request(app.getHttpServer())
        .delete(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { name, description } = await res.body;
      expect(name).toEqual(fakeName);
      expect(description).toEqual(fakeDesc);
    });
  });

  async function generateDummyOrderType() {
    const fakeName = faker.string.alphanumeric({ length: 5 });
    const fakePrice = +faker.commerce.price({ min: 1000, max: 10000, dec: 0 });
    const fakeDesc = faker.lorem.words();
    const postRes = await request(app.getHttpServer())
      .post(url)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: fakeName, price: fakePrice, description: fakeDesc })
      .expect(201);
    return { fakeName, fakePrice, fakeDesc, body: postRes.body };
  }
});
