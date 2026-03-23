import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { buildApp, truncateAll } from './utils';

describe('Order Status Flow (e2e)', () => {
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

  it('should mark print, pay, and taken for an order', async () => {
    await request(app.getHttpServer())
      .post('/order-types')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'FLOW STATUS TYPE',
        price: 24000,
        description: 'Status flow order type',
      })
      .expect(201);

    const orderRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        date: new Date().toISOString(),
        customer: 'STATUS FLOW CUSTOMER',
        description: 'Status flow order',
        orderDetails: [
          {
            name: 'FLOW STATUS TYPE',
            price: 24000,
            width: 200,
            height: 100,
            qty: 2,
            design: 1,
            eyelets: false,
            shiming: false,
            description: 'Status flow detail',
          },
        ],
      })
      .expect(201);

    const orderId = orderRes.body.id;
    const orderDetailId = orderRes.body.OrderDetails?.[0]?.id;
    expect(orderId).toBeTruthy();
    expect(orderDetailId).toBeTruthy();

    const printedRes = await request(app.getHttpServer())
      .post(`/orders/detail/${orderDetailId}/print`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: true,
        printAt: new Date().toISOString(),
        description: 'Printed for flow test',
      })
      .expect(200);
    expect(printedRes.body.status).toBe(true);

    const payRes = await request(app.getHttpServer())
      .post(`/orders/${orderId}/pay`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: true,
        payAt: new Date().toISOString(),
        description: 'Paid for flow test',
      })
      .expect(200);
    expect(payRes.body.status).toBe(true);

    const takenRes = await request(app.getHttpServer())
      .post(`/orders/${orderId}/taken`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: true,
        takenAt: new Date().toISOString(),
        description: 'Taken for flow test',
      })
      .expect(200);
    expect(takenRes.body.status).toBe(true);
  });
});
