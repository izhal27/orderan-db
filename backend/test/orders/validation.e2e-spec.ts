import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { de, faker } from '@faker-js/faker';

import { setupE2ETest, teardownE2ETest, url } from './utils';

describe('OrdersController -- Validation (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  const invalidCases = [
    ['date', ''],
    ['customer', ''],
    ['orderDetails', ''],
    ['orderDetails', '123abc'],
  ];

  test.each(invalidCases)(
    'should return 400 when %s is invalid',
    async (field, value) => {
      const payload = {
        date: new Date().toISOString(),
        customer: faker.internet.displayName().toUpperCase(),
        orderDetails: [],
        description: faker.lorem.words(),
      };
      payload[field] = value;

      await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload)
        .expect(400);
    },
  );
});
