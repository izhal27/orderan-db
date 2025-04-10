import { INestApplication } from '@nestjs/common';
// import request from 'supertest';

import {
  expectOrderMatch,
  generateDummyOrder,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('OrdersController -- Create (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  // const post = (data: any) =>
  //   request(app.getHttpServer())
  //     .post(url)
  //     .set('Authorization', `Bearer ${accessToken}`)
  //     .send(data);

  it('should create an order', async () => {
    const { fakeDate, fakeCustomer, fakeDesc, fakeOrderDetails, body } =
      await generateDummyOrder(app, accessToken);

    expectOrderMatch(body, {
      date: fakeDate,
      customer: fakeCustomer,
      description: fakeDesc,
      orderDetails: fakeOrderDetails,
    });
  });
});
