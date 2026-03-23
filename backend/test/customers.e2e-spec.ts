import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp, truncateCustomers } from './utils';

const url = '/customers';

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
    .send({ username: 'admin', password: '12345' })
    .expect(200);

  return { accessToken: res.body.access_token, app, prisma };
};

const teardownE2ETest = async (app: INestApplication) => {
  await truncateCustomers();
  await prisma.$disconnect();
  await app.close();
};

const generateDummyCustomer = async (
  app: INestApplication,
  accessToken: string,
  name: string = '',
): Promise<{
  fake: {
    name: string;
    address: string;
    contact: string;
    email: string;
    description: string;
  };
  res: any;
}> => {
  const fake = {
    name:
      name.length > 0
        ? name.toUpperCase()
        : faker.person.fullName().toUpperCase(),
    address: faker.location.streetAddress(),
    contact: faker.phone.number(),
    email: faker.internet.email(),
    description: faker.lorem.words(),
  };

  const res = await request(app.getHttpServer())
    .post('/customers')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(fake)
    .expect(201);

  return { fake, res };
};

function expectCustomerMatch(body, expected) {
  expect(body.name).toEqual(expected.name);
  expect(body.address).toEqual(expected.address);
  expect(body.contact).toEqual(expected.contact);
  expect(body.email).toEqual(expected.email);
  expect(body.description).toEqual(expected.description);
}

describe('CustomersController (e2e)', () => {
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
    const { fake, res: createRes } = await generateDummyCustomer(
      app,
      accessToken,
    );
    expectCustomerMatch(createRes.body, fake);

    // read list
    const listRes = await get().expect(200);
    expect(Array.isArray(listRes.body.data)).toBe(true);

    // read single
    const singleRes = await get(`/${createRes.body.id}`).expect(200);
    expectCustomerMatch(singleRes.body, fake);

    // update
    const update = {
      name: 'UPDATED NAME',
      address: faker.location.streetAddress(),
      contact: faker.phone.number(),
      email: faker.internet.email(),
      description: faker.lorem.words(),
    };
    const updateRes = await patch(`/${createRes.body.id}`, update).expect(200);
    expectCustomerMatch(updateRes.body, update);

    // delete
    const deleteRes = await del(`/${createRes.body.id}`).expect(200);
    expectCustomerMatch(deleteRes.body, update);
  });

  it('should allow duplicate name', async () => {
    await generateDummyCustomer(app, accessToken, 'default');
    await generateDummyCustomer(app, accessToken, 'default');
  });
});
