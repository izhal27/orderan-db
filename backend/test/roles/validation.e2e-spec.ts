import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { setupE2ETest, teardownE2ETest, generateDummyRole, url } from './utils';

describe('RolesController -- Validation (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });
  afterAll(async () => await teardownE2ETest());

  const invalidCases = [
    ['name', ''],
    ['name', 'Name with spaces'],
  ];

  test.each(invalidCases)(
    'should return 400 when %s is invalid',
    async (field, value) => {
      const payload = {
        name: faker.string.alphanumeric(5).toUpperCase(),
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
