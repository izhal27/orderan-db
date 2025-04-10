import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { setupE2ETest, teardownE2ETest, url } from './utils';

describe('Customers Controller -- Validation (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  const invalidCases = [
    ['name', ''],
    ['email', 'invalid'],
    ['contact', 12345],
  ];

  test.each(invalidCases)(
    'should return 400 when %s is invalid',
    async (field, value) => {
      const payload = {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        contact: faker.phone.number(),
        email: faker.internet.email(),
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
