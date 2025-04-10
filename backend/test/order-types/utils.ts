import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp, truncateOrderTypes } from '../utils';

export let app: INestApplication;
export let prisma: PrismaClient;
export const url = '/order-types';

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
  await truncateOrderTypes(); // Clean up order-types
  await prisma.$disconnect();
  await app.close();
};

export const generateDummyOrderType = async (
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
