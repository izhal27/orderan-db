import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { buildApp, truncateAll } from './utils';

describe('Order Cancel Status Flow (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ app } = await buildApp());
    const res = await request(app.getHttpServer())
      .post('/auth/local/signin')
      .send({ username: 'admin', password: '12345' })
      .expect(200);
    accessToken = res.body.access_token;
  });

  afterAll(async () => {
    await truncateAll();
    await app.close();
  });

  it('should cancel print, pay, and taken statuses', async () => {
    await request(app.getHttpServer())
      .post('/order-types')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'FLOW CANCEL TYPE',
        price: 24000,
        description: 'Cancel flow order type',
      })
      .expect(201);

    const orderRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        date: new Date().toISOString(),
        customer: 'CANCEL FLOW CUSTOMER',
        description: 'Cancel flow order',
        orderDetails: [
          {
            name: 'FLOW CANCEL TYPE',
            price: 24000,
            width: 200,
            height: 100,
            qty: 2,
            design: 1,
            eyelets: false,
            shiming: false,
            description: 'Cancel flow detail',
          },
        ],
      })
      .expect(201);

    const orderId = orderRes.body.id;
    const orderDetailId = orderRes.body.OrderDetails?.[0]?.id;
    expect(orderId).toBeTruthy();
    expect(orderDetailId).toBeTruthy();

    await request(app.getHttpServer())
      .post(`/orders/detail/${orderDetailId}/print`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: true,
        printAt: new Date().toISOString(),
        description: 'Printed for cancel flow',
      })
      .expect(200);

    const cancelPrintRes = await request(app.getHttpServer())
      .post(`/orders/detail/${orderDetailId}/cancel-print`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(cancelPrintRes.body.status).toBe(false);

    await request(app.getHttpServer())
      .post(`/orders/${orderId}/pay`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: true,
        payAt: new Date().toISOString(),
        description: 'Paid for cancel flow',
      })
      .expect(200);

    const cancelPayRes = await request(app.getHttpServer())
      .post(`/orders/${orderId}/cancel-pay`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(cancelPayRes.body.status).toBe(false);

    await request(app.getHttpServer())
      .post(`/orders/${orderId}/taken`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: true,
        takenAt: new Date().toISOString(),
        description: 'Taken for cancel flow',
      })
      .expect(200);

    const cancelTakenRes = await request(app.getHttpServer())
      .post(`/orders/${orderId}/cancel-taken`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(cancelTakenRes.body.status).toBe(false);
  });
});
