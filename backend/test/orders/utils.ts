import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp, truncateOrders } from '../utils';

jest.setTimeout(100 * 1000);
export let app: INestApplication;
export let prisma: PrismaClient;
export const url = '/orders';

export const setupE2ETest = async (): Promise<{
  accessToken: string;
  app: INestApplication;
  prisma: PrismaClient;
}> => {
  ({ app, prismaClient: prisma } = await buildApp());
  const res = await request(app.getHttpServer())
    .post('/auth/local/signin')
    .send({ username: 'admin', password: '12345' });

  return { accessToken: res.body.access_token, app, prisma };
};

export const teardownE2ETest = async () => {
  await truncateOrders();
  await prisma.$disconnect();
  await app.close();
};

export const generateDummyOrder = async (
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

export const createOrder = (overrides = {}) => ({
  date: new Date().toISOString(),
  customer: faker.internet.displayName().toUpperCase(),
  description: faker.lorem.words(),
  orderDetails: createOrderDetails(),
  ...overrides,
});

export const createOrderDetails = (length = 5, overrides = {}) => {
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

export function expectOrderMatch(body, expected) {
  expect(body.date).toEqual(expected.date);
  expect(body.customer).toEqual(expected.customer);
  expect(body.description).toEqual(expected.description);
  expect(Array.isArray(body.OrderDetails)).toBe(true);
  expect(body.OrderDetails.length).toEqual(expected.orderDetails.length);
}
