import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp, truncateOrderTypes } from './utils';

const url = '/order-types';

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
  await truncateOrderTypes();
  await prisma.$disconnect();
  await app.close();
};

const generateDummyOrderType = async (
  app: INestApplication,
  accessToken: string,
): Promise<{
  fake: {
    name: string;
    price: number;
    description: string;
  };
  res: any;
}> => {
  const fake = {
    name: faker.string.alphanumeric(5).toUpperCase(),
    price: +faker.commerce.price({ min: 1000, max: 10000, dec: 0 }),
    description: faker.lorem.words(),
  };

  const res = await request(app.getHttpServer())
    .post(`${url}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(fake)
    .expect(201);

  return { fake, res };
};

describe('OrderTypesController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest(app));

  it('should run create → read → update → delete flow', async () => {
    const post = (data: any) =>
      request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data);

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
    const { fake, res: createRes } = await generateDummyOrderType(
      app,
      accessToken,
    );
    expect(createRes.body.name).toBe(fake.name);
    expect(createRes.body.price).toBe(fake.price);
    expect(createRes.body.description).toBe(fake.description);

    // read list
    const listRes = await get().expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);

    // read single
    const singleRes = await get(`/${createRes.body.id}`).expect(200);
    expect(singleRes.body.name).toBe(fake.name);
    expect(singleRes.body.description).toBe(fake.description);

    // update
    const update = {
      name: 'UPDATED NAME',
      description: faker.lorem.words(),
    };
    const updateRes = await patch(`/${createRes.body.id}`, update).expect(200);
    expect(updateRes.body.name).toBe(update.name);
    expect(updateRes.body.description).toBe(update.description);

    // delete
    const deleteRes = await del(`/${createRes.body.id}`).expect(200);
    expect(deleteRes.body.name).toBe(update.name);
  });

  it('should return 409 for duplicate name', async () => {
    const post = (data: any) =>
      request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data);

    await post({
      name: 'Order Type default',
      price: 1000,
      description: 'x',
    }).expect(201);
    await post({
      name: 'Order Type default',
      price: 1000,
      description: 'x',
    }).expect(409);
  });
});
