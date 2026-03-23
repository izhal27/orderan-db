import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp, truncateOrders } from './utils';

const url = '/orders';

let prisma: PrismaClient;

const setupE2ETest = async (): Promise<{
  accessToken: string;
  app: INestApplication;
  prisma: PrismaClient;
}> => {
  const { app, prismaClient } = await buildApp();
  prisma = prismaClient;
  const res = await request(app.getHttpServer())
    .post('/auth/local/signin')
    .send({ username: 'admin', password: '12345' });

  return { accessToken: res.body.access_token, app, prisma };
};

const teardownE2ETest = async (app: INestApplication) => {
  await truncateOrders();
  await prisma.$disconnect();
  await app.close();
};

const createOrderDetails = (length = 5, overrides = {}) => {
  return Array.from({ length }).map(() => ({
    name: faker.commerce.productName(),
    price: +faker.finance.amount({ min: 1000, max: 10000, dec: 0 }),
    width: +faker.finance.amount({ min: 100, max: 1000, dec: 0 }),
    height: +faker.finance.amount({ min: 100, max: 1000, dec: 0 }),
    qty: +faker.finance.amount({ min: 1, max: 100, dec: 0 }),
    design: +faker.finance.amount({ min: 1, max: 10, dec: 0 }),
    eyelets: true,
    shiming: true,
    description: faker.lorem.words(),
    ...overrides,
  }));
};

const generateDummyOrder = async (
  app: INestApplication,
  accessToken: string,
): Promise<{
  body: any;
  fakeDate: string;
  fakeCustomer: string;
  fakeDesc: string;
  fakeOrderDetails: any[];
}> => {
  const fakeDate = new Date().toISOString();
  const fakeCustomer = faker.internet.displayName().toUpperCase();
  const fakeDesc = faker.lorem.words();
  const fakeOrderDetails = createOrderDetails();

  const { body } = await request(app.getHttpServer())
    .post(url)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      date: fakeDate,
      customer: fakeCustomer,
      description: fakeDesc,
      orderDetails: fakeOrderDetails,
    })
    .timeout(100 * 1000)
    .expect(201)
    .catch((err) => {
      console.error('Error in generateDummyOrder:', err);
      throw err;
    });

  return { body, fakeDate, fakeCustomer, fakeDesc, fakeOrderDetails };
};

function expectOrderMatch(body, expected) {
  expect(body.date).toEqual(expected.date);
  expect(body.customer).toEqual(expected.customer);
  expect(body.description).toEqual(expected.description);
  expect(Array.isArray(body.OrderDetails)).toBe(true);
  expect(body.OrderDetails.length).toEqual(expected.orderDetails.length);
}

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest(app));

  it('should run create → read → update → delete flow', async () => {
    const get = (path = '') =>
      request(app.getHttpServer())
        .get(`${url}${path}`)
        .set('Authorization', `Bearer ${accessToken}`);

    const patch = (path: string, data: any) =>
      request(app.getHttpServer())
        .patch(`${url}${path}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data);

    const del = (path: string) =>
      request(app.getHttpServer())
        .delete(`${url}${path}`)
        .set('Authorization', `Bearer ${accessToken}`);

    // create
    const { fakeDate, fakeCustomer, fakeDesc, fakeOrderDetails, body } =
      await generateDummyOrder(app, accessToken);
    expectOrderMatch(body, {
      date: fakeDate,
      customer: fakeCustomer,
      description: fakeDesc,
      orderDetails: fakeOrderDetails,
    });

    // read list
    const listRes = await get().expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);

    // read single
    const singleRes = await get(`/${body.id}`).expect(200);
    expectOrderMatch(singleRes.body, {
      date: fakeDate,
      customer: fakeCustomer,
      description: fakeDesc,
      orderDetails: fakeOrderDetails,
    });

    // update
    const newOrderDetail = createOrderDetails(1)[0];
    const updatedOrderDetail = createOrderDetails(1, {
      id: body.OrderDetails[0].id,
    })[0];
    const orderDetails = body.OrderDetails.map((orderDetail) => {
      if (orderDetail.id === updatedOrderDetail['id']) {
        return {
          ...orderDetail,
          ...updatedOrderDetail,
        };
      }
      return orderDetail;
    });
    const update = {
      date: new Date().toISOString(),
      customer: faker.internet.displayName().toUpperCase(),
      description: faker.lorem.words(),
      orderDetails: [...orderDetails, newOrderDetail],
    };
    const updateRes = await patch(`/${body.id}`, update).expect(200);
    expectOrderMatch(updateRes.body, update);

    // delete
    const deleteRes = await del(`/${body.id}`).expect(200);
    expectOrderMatch(deleteRes.body, update);
  });
});
