import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp } from './setup.e2e';

const dummyOrder = {
  date: new Date(),
  customer: 'customer name',
  orderDetails: [
    {
      name: 'Detail order',
      width: 200,
      height: 100,
      qty: 1,
      design: 1,
      eyelets: true,
      shiming: false,
      userId: 1,
    },
  ],
};

describe('OrderTypesController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let accessToken = '';

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    const res = await request(app.getHttpServer())
      .post('/auth/local/signup')
      .send({
        username: faker.internet.userName(),
        password: faker.internet.password({ length: 5 })
      })
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
    it('should throw error 400 when date is missing', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...dummyOrder, date: '' })
        .expect(400);
    });

    it('should throw error 400 when customer is missing', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...dummyOrder, customer: '' })
        .expect(400);
    });

    it('should throw error 400 when order detail is missing', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...dummyOrder, orderDetails: null })
        .expect(400);
    });

    it('should throw error 400 when some order detail field is missing', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...dummyOrder, orderDetails: [{ ...dummyOrder.orderDetails, name: '' }] })
        .expect(400);
    });

    it('should create a order', async () => {
      const {
        fakeName,
        fakePrice,
        fakeDesc,
        body: { name, price, description },
      } = await generateDummyOrder(app, accessToken);
      expect(name).toEqual(fakeName);
      expect(new Decimal(price)).toEqual(fakePrice);
      expect(description).toEqual(fakeDesc);
    });
  });

  // <---------------- READ ---------------->
  describe('Read', () => {
    it.skip('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .get('/orders/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it.skip('should throw error 404 when order not found', async () => {
      await request(app.getHttpServer())
        .get('/orders/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it.skip('should return list of order', async () => {
      const res = await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const order = await res.body;
      expect(order).not.toBe(null);
      expect(order).toBeInstanceOf(Array);
    });

    it.skip('should return a order', async () => {
      const {
        fakeName,
        fakeDesc,
        body: { id },
      } = await generateDummyOrder(app, accessToken);
      const res = await request(app.getHttpServer())
        .get(`/orders/${id}`)
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
        .patch('/orders/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it.skip('should throw error 400 when name is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: faker.string.alphanumeric({ length: 5 }),
          description: 'This is a description',
        })
        .expect(201);
      const { id } = await res.body;
      await request(app.getHttpServer())
        .patch(`/orders/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it.skip('should throw error 404 when order not found', async () => {
      await request(app.getHttpServer())
        .patch('/orders/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });

    it.skip('should return updated order', async () => {
      const updateRole = {
        name: 'updatedrole',
        description: faker.lorem.words(),
      };
      const {
        body: { id },
      } = await generateDummyOrder(app, accessToken);
      const res = await request(app.getHttpServer())
        .patch(`/orders/${id}`)
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
        .delete('/orders/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it.skip('should throw error 404 when order not found', async () => {
      await request(app.getHttpServer())
        .delete('/orders/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it.skip('should return a order', async () => {
      const {
        fakeName,
        fakeDesc,
        body: { id },
      } = await generateDummyOrder(app, accessToken);
      const res = await request(app.getHttpServer())
        .delete(`/orders/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { name, description } = await res.body;
      expect(name).toEqual(fakeName);
      expect(description).toEqual(fakeDesc);
    });
  });
});

async function generateDummyOrder(
  app: INestApplication<any>,
  accessToken: string,
) {
  const fakeName = faker.string.alphanumeric({ length: 5 });
  const fakePrice = new Decimal(5000);
  const fakeDesc = faker.lorem.words();
  const postRes = await request(app.getHttpServer())
    .post('/orders')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ name: fakeName, price: fakePrice, description: fakeDesc })
    .expect(201);
  return { fakeName, fakePrice, fakeDesc, body: postRes.body };
}
