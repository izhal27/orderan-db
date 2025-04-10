import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  expectCustomerMatch,
  generateDummyCustomer,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('CustomersController -- Read (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  const get = (path = '') =>
    request(app.getHttpServer())
      .get(`${url}${path}`)
      .set('Authorization', `Bearer ${accessToken}`);

  it('should return 404 for non-existent id', async () => {
    await get('/99999').expect(404);
  });

  it('should return a list of customers', async () => {
    const res = await get().expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return a single customer', async () => {
    const { fake, res: createRes } = await generateDummyCustomer(
      app,
      accessToken,
    );
    const res = await get(`/${createRes.body.id}`).expect(200);
    expectCustomerMatch(res.body, fake);
  });
});
