import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp } from './utils';

const url = '/roles';

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
  await prisma.$disconnect();
  await app.close();
};

const generateDummyRole = async (
  app: INestApplication,
  accessToken: string,
): Promise<{
  fake: {
    name: string;
    description: string;
  };
  res: any;
}> => {
  const fake = {
    name: faker.string.alphanumeric(5).toUpperCase(),
    description: faker.lorem.words(),
  };

  const res = await request(app.getHttpServer())
    .post(`${url}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(fake)
    .expect(201);

  return { fake, res };
};

describe('RolesController (e2e)', () => {
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
    const { fake, res: createRes } = await generateDummyRole(app, accessToken);
    expect(createRes.body.name).toBe(fake.name);
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
      name: 'UPDATED',
      description: faker.lorem.words(),
    };
    const updateRes = await patch(`/${createRes.body.id}`, update).expect(200);
    expect(updateRes.body.name).toBe(update.name);
    expect(updateRes.body.description).toBe(update.description);

    // delete
    const deleteRes = await del(`/${createRes.body.id}`).expect(200);
    expect(deleteRes.body.name).toBe(update.name);
    expect(deleteRes.body.description).toBe(update.description);
  });

  it('should return 409 if role already exists', async () => {
    const post = (data: any) =>
      request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data);

    await post({
      name: 'Default',
      description: 'x',
    }).expect(201);
    await post({
      name: 'Default',
      description: 'x',
    }).expect(409);
  });
});
