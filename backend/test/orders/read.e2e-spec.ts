import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  expectOrderMatch,
  generateDummyOrder,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('OrdersController -- Read (e2e)', () => {
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

  it('404 if not found', async () => {
    await get('/99999').expect(404);
  });

  it('should list orders', async () => {
    await generateDummyOrder(app, accessToken);
    const res = await get().expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get single order', async () => {
    const { fakeDate, fakeCustomer, fakeDesc, fakeOrderDetails, body } =
      await generateDummyOrder(app, accessToken);
    const res = await request(app.getHttpServer())
      .get(`/orders/${body.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expectOrderMatch(res.body, {
      date: fakeDate,
      customer: fakeCustomer,
      description: fakeDesc,
      orderDetails: fakeOrderDetails,
    });
  });
});
