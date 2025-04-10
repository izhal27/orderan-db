import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp } from '../utils';

export let app: INestApplication;
export let prisma: PrismaClient;
export let accessToken: string;
export const url = '/roles';

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

export const generateDummyRole = async (
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
