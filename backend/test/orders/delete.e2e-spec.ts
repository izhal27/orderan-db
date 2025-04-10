import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  expectOrderMatch,
  generateDummyOrder,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('OrdersController -- Delete (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  const del = (path: string) =>
    request(app.getHttpServer())
      .delete(`${url}${path}`)
      .set('Authorization', `Bearer ${accessToken}`);

  it('should return 404 for non-existent id', async () => {
    await del('/99999').expect(404);
  });

  it('should delete an order and return it', async () => {
    const { body, fakeDate, fakeCustomer, fakeDesc, fakeOrderDetails } =
      await generateDummyOrder(app, accessToken);
    const result = await del(`/${body.id}`).expect(200);
    expectOrderMatch(result.body, {
      date: fakeDate,
      customer: fakeCustomer,
      description: fakeDesc,
      orderDetails: fakeOrderDetails,
    });
  });
});
