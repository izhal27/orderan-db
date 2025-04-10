import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp, truncateCustomers } from '../utils';

export let app: INestApplication;
export let prisma: PrismaClient;
export const url = '/customers';

export const setupE2ETest = async (): Promise<{
  accessToken: string;
  app: INestApplication;
  prisma: PrismaClient;
}> => {
  ({ app, prismaClient: prisma } = await buildApp());
  const res = await request(app.getHttpServer())
    .post('/auth/local/signin')
    .send({ username: 'admin', password: '12345' })
    .expect(200);

  return { accessToken: res.body.access_token, app, prisma };
};

export const teardownE2ETest = async () => {
  await truncateCustomers(); // Clean up customers
  await prisma.$disconnect();
  await app.close();
};

export const generateDummyCustomer = async (
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

export function expectCustomerMatch(body, expected) {
  expect(body.name).toEqual(expected.name);
  expect(body.address).toEqual(expected.address);
  expect(body.contact).toEqual(expected.contact);
  expect(body.email).toEqual(expected.email);
  expect(body.description).toEqual(expected.description);
}
