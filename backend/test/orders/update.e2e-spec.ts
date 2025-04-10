import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import {
  createOrderDetails,
  expectOrderMatch,
  generateDummyOrder,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('OrdersController -- Update (e2e)', () => {
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

  it('should return 404 for non-existent id', async () => {
    await patch('/99999', {
      date: new Date().toISOString(),
      customer: 'xxxxx',
      description: faker.lorem.words(),
      orderDetails: createOrderDetails(1),
    }).expect(404);
  });

  it('should update an order', async () => {
    const { body } = await generateDummyOrder(app, accessToken);
    const newOrderDetail = createOrderDetails(1)[0];
    const updatedOrderDetail = createOrderDetails(1, {
      id: body.OrderDetails[0].id,
    })[0];
    const orderDetails = body.OrderDetails.map((orderDetail) => {
      if (orderDetail.id === updatedOrderDetail['id']) {
        return {
          ...orderDetail,
          ...updatedOrderDetail,
        };
      }
      return orderDetail;
    });
    const update = {
      date: new Date().toISOString(),
      customer: faker.internet.displayName().toUpperCase(),
      description: faker.lorem.words(),
      orderDetails: [...orderDetails, newOrderDetail],
    };
    const result = await patch(`/${body.id}`, update).expect(200);
    expectOrderMatch(result.body, update);
  });
});
