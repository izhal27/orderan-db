import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { buildApp, truncateAll } from './utils';

describe('Orders Cancel Print Many (e2e)', () => {
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

  it('should cancel printed status for multiple order details', async () => {
    const orderRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        date: new Date().toISOString(),
        customer: 'CANCEL PRINT MANY CUSTOMER',
        description: 'Cancel print many order',
        orderDetails: [
          {
            name: 'CANCEL PRINT MANY A',
            price: 24000,
            width: 200,
            height: 100,
            qty: 2,
            design: 1,
            eyelets: false,
            shiming: false,
            description: 'Detail A',
          },
          {
            name: 'CANCEL PRINT MANY B',
            price: 12000,
            width: 100,
            height: 50,
            qty: 1,
            design: 1,
            eyelets: false,
            shiming: false,
            description: 'Detail B',
          },
        ],
      })
      .expect(201);

    const orderDetailIds = orderRes.body.OrderDetails.map((od) => od.id);

    await request(app.getHttpServer())
      .post('/orders/detail/print-many')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        orderDetailIds,
        status: true,
        printAt: new Date().toISOString(),
        description: 'bulk',
      })
      .expect(200);

    const cancelRes = await request(app.getHttpServer())
      .post('/orders/detail/cancel-print-many')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ orderDetailIds })
      .expect(200);

    expect(Array.isArray(cancelRes.body)).toBe(true);
    expect(cancelRes.body.length).toBe(orderDetailIds.length);
    expect(cancelRes.body.every((p) => p.status === false)).toBe(true);
  });
});
