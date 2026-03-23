import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { buildApp, truncateAll } from './utils';

describe('Orders Print Many (e2e)', () => {
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

  it('should mark multiple order details as printed', async () => {
    const orderRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        date: new Date().toISOString(),
        customer: 'PRINT MANY CUSTOMER',
        description: 'Print many order',
        orderDetails: [
          {
            name: 'PRINT MANY TYPE A',
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
            name: 'PRINT MANY TYPE B',
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

    const markRes = await request(app.getHttpServer())
      .post('/orders/detail/print-many')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        orderDetailIds,
        status: true,
        printAt: new Date().toISOString(),
        description: 'bulk',
      })
      .expect(200);

    expect(Array.isArray(markRes.body)).toBe(true);
    expect(markRes.body.length).toBe(orderDetailIds.length);
    expect(markRes.body.every((p) => p.status === true)).toBe(true);
  });
});
