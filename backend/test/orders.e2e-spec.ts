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

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let accessToken = '';

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    const res = await request(app.getHttpServer())
      .post('/auth/local/signup')
      .send({
        username: 'orderuser',
        password: '12345',
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
        .send({
          ...dummyOrder,
          orderDetails: [{ ...dummyOrder.orderDetails, name: '' }],
        })
        .expect(400);
    });

    it('should create a order', async () => {
      const {
        fakeDate,
        fakeCustomer,
        fakeDesc,
        fakeOrderDetails,
        body: { date, customer, description, orderDetails },
      } = await generateDummyOrder();
      expect(date).toEqual(fakeDate);
      expect(customer).toEqual(fakeCustomer);
      expect(description).toEqual(fakeDesc);
      expect(orderDetails.length).toEqual(fakeOrderDetails.length);
    });
  });

  // <---------------- READ ---------------->
  describe('Read', () => {
    it('should throw error 404 when order not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/orders/abc123')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

    });

    it('should return list of order', async () => {
      const res = await request(app.getHttpServer())
        .get('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const orders = await res.body;
      expect(orders).not.toBe(null);
      expect(orders).toBeInstanceOf(Array);
      expect(orders[0].orderDetails).toBeInstanceOf(Array);
    });

    it('should return a order', async () => {
      const {
        fakeDate,
        fakeCustomer,
        fakeDesc,
        fakeOrderDetails,
        body: { id },
      } = await generateDummyOrder();
      const res = await request(app.getHttpServer())
        .get(`/orders/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { date, customer, description, orderDetails } = await res.body;
      expect(date).toEqual(fakeDate);
      expect(customer).toEqual(fakeCustomer);
      expect(description).toEqual(fakeDesc);
      expect(orderDetails.length).toEqual(fakeOrderDetails.length);
    });
  });

  // <---------------- UPDATE ---------------->
  describe('Update', () => {
    it('should throw error 400 when date is missing', async () => {
      const { body: { id } } = await generateDummyOrder();
      await request(app.getHttpServer())
        .patch(`/orders/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...dummyOrder, date: '' })
        .expect(400);
    });

    it('should throw error 404 when order not found', async () => {
      await request(app.getHttpServer())
        .patch('/orders/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });

    it('should return updated order', async () => {
      const {
        body: { id, orderDetails },
      } = await generateDummyOrder();
      const updatedOrderDetail = {
        id: orderDetails[0].id,
        name: faker.internet.displayName(),
        price: +faker.finance.amount({ min: 1000, max: 10000, dec: 0 }),
        width: +faker.finance.amount({ min: 100, max: 1000, dec: 0 }),
        height: +faker.finance.amount({ min: 100, max: 1000, dec: 0 }),
        qty: +faker.finance.amount({ min: 1, max: 100, dec: 0 }),
        design: +faker.finance.amount({ min: 1, max: 10, dec: 0 }),
        eyelets: false,
        shiming: false,
        description: faker.lorem.words(),
      }
      let updateOrder = {
        date: new Date().toISOString(),
        customer: faker.internet.displayName(),
        description: faker.lorem.words(),
        orderDetails: [...orderDetails, updatedOrderDetail]
      };
      const res = await request(app.getHttpServer())
        .patch(`/orders/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateOrder)
        .expect(200);
      const {
        date,
        customer,
        description,
        updatedById,
        createdAt,
        updatedAt,
        orderDetails: upOd } = await res.body;
      expect(date).toEqual(updateOrder.date);
      expect(customer).toEqual(updateOrder.customer);
      expect(description).toEqual(updateOrder.description);
      expect(updatedById).not.toBeNull();
      expect(createdAt).not.toEqual(updatedAt);
      expect(updatedOrderDetail.name).toEqual(upOd[0].name);
      expect(updatedOrderDetail.price).toEqual(upOd[0].price);
      expect(updatedOrderDetail.width).toEqual(upOd[0].width);
      expect(updatedOrderDetail.height).toEqual(upOd[0].height);
      expect(updatedOrderDetail.qty).toEqual(upOd[0].qty);
      expect(updatedOrderDetail.design).toEqual(upOd[0].design);
    });
  });

  // <---------------- DELETE ---------------->
  describe('Delete', () => {
    it('should throw error 404 when order not found', async () => {
      await request(app.getHttpServer())
        .delete('/orders/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return a order', async () => {
      const {
        fakeDate,
        fakeCustomer,
        fakeDesc,
        fakeOrderDetails,
        body: { id },
      } = await generateDummyOrder();
      const res = await request(app.getHttpServer())
        .delete(`/orders/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { date, customer, description, orderDetails } = await res.body;
      expect(date).toEqual(fakeDate);
      expect(customer).toEqual(fakeCustomer);
      expect(description).toEqual(fakeDesc);
      expect(orderDetails.length).toEqual(fakeOrderDetails.length);
    });
  });

  async function generateDummyOrder() {
    const fakeDate = new Date().toISOString();
    const fakeCustomer = faker.internet.displayName();
    const fakeDesc = faker.lorem.words();
    const fakeOrderDetails = Array.from({ length: 10 }).map(() => ({
      name: faker.internet.displayName(),
      price: +faker.finance.amount({ min: 1000, max: 10000, dec: 0 }),
      width: +faker.finance.amount({ min: 100, max: 1000, dec: 0 }),
      height: +faker.finance.amount({ min: 100, max: 1000, dec: 0 }),
      qty: +faker.finance.amount({ min: 1, max: 100, dec: 0 }),
      design: +faker.finance.amount({ min: 1, max: 10, dec: 0 }),
      eyelets: true,
      shiming: true,
      description: faker.lorem.words(),
    }));
    const postRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        date: fakeDate,
        customer: fakeCustomer,
        description: fakeDesc,
        orderDetails: fakeOrderDetails,
      })
      .expect(201);
    return {
      fakeDate,
      fakeCustomer,
      fakeDesc,
      fakeOrderDetails,
      body: postRes.body,
    };
  }
});
