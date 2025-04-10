import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp } from '../utils';

export let app: INestApplication;
export let prisma: PrismaClient;
export const url = '/users';

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
  await prisma.$disconnect();
  await app.close();
};

export const generateDummyUser = async (
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

export function expectUserMatch(body, expected) {
  expect(body.username).toEqual(expected.username);
  expect(body.email).toEqual(expected.email);
  expect(body.password).not.toBeNull();
  expect(body.password).not.toBe('');
  expect(body.name).toEqual(expected.name);
  expect(body.image).toEqual(expected.image);
}
