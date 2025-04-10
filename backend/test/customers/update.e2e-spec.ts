import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import {
  expectCustomerMatch,
  generateDummyCustomer,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('CustomersController -- Update (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  const patch = (path: string, data: any) =>
    request(app.getHttpServer())
      .patch(`${url}${path}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data);

  it('should return 400 when name is empty', async () => {
    const { res } = await generateDummyCustomer(app, accessToken);
    await patch(`/${res.body.id}`, { name: '' }).expect(400);
  });

  it('should return 404 for non-existent id', async () => {
    await patch('/99999', { name: 'xxxxx' }).expect(404);
  });

  it('should update a customer', async () => {
    const { res } = await generateDummyCustomer(app, accessToken);
    const update = {
      name: 'UPDATED NAME',
      address: faker.location.streetAddress(),
      contact: faker.phone.number(),
      email: faker.internet.email(),
      description: faker.lorem.words(),
    };
    const result = await patch(`/${res.body.id}`, update).expect(200);
    expectCustomerMatch(result.body, update);
  });
});
