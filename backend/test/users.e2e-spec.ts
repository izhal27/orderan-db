import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp } from './utils';

const url = '/users';

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

const generateDummyUser = async (
  app: INestApplication,
  accessToken: string,
): Promise<{
  fake: {
    username: string;
    email: string;
    password: string;
    name: string;
    image: string;
  };
  res: any;
}> => {
  const fake = {
    username: faker.string.alphanumeric(7).toLowerCase(),
    email: faker.internet.email(),
    password: faker.string.alphanumeric(7).toLowerCase(),
    name: faker.string.alphanumeric(7).toUpperCase(),
    image: faker.image.avatar(),
  };
  const res = await request(app.getHttpServer())
    .post(`${url}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(fake)
    .expect(201);

  return { fake, res };
};

function expectUserMatch(body, expected) {
  expect(body.username).toEqual(expected.username);
  expect(body.email).toEqual(expected.email);
  expect(body.password).not.toBeNull();
  expect(body.password).not.toBe('');
  expect(body.name).toEqual(expected.name);
  expect(body.image).toEqual(expected.image);
}

describe('UsersController (e2e)', () => {
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
    const { fake, res: createRes } = await generateDummyUser(
      app,
      accessToken,
    );
    expectUserMatch(createRes.body, fake);

    // read list
    const listRes = await get().expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);

    // read single
    const singleRes = await get(`/${createRes.body.id}`).expect(200);
    expectUserMatch(singleRes.body, fake);

    // update
    const update = {
      username: 'USERNAMEUPDATED',
      name: 'NAMEUPDATED',
      email: 'email_update@gmail.com',
      image: '/updated-image',
    };
    const updateRes = await patch(`/${createRes.body.id}`, update).expect(200);
    expectUserMatch(updateRes.body, update);

    // delete
    const deleteRes = await del(`/${createRes.body.id}`).expect(200);
    expectUserMatch(deleteRes.body, update);
  });

  it('should return 409 if user already exists', async () => {
    const post = (data: any) =>
      request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data);

    await post({
      username: 'default',
      password: '12345',
    }).expect(201);
    await post({
      username: 'default',
      password: '12345',
    }).expect(409);
  });
});
