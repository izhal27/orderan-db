import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  expectCustomerMatch,
  generateDummyCustomer,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('Customers Controller -- Create (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  const post = (data: any) =>
    request(app.getHttpServer())
      .post(url)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data);

  it('should create a customer', async () => {
    const { fake, res } = await generateDummyCustomer(app, accessToken);
    expectCustomerMatch(res.body, fake);
  });

  it('should allow duplicate name', async () => {
    await generateDummyCustomer(app, accessToken, 'default');
    await generateDummyCustomer(app, accessToken, 'default');
  });
});
