import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { buildApp, truncateAll } from './utils';

describe('Order Flow (e2e)', () => {
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

  it('should create order-type, customer, then order', async () => {
    await request(app.getHttpServer())
      .post('/order-types')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'FLEXY BANNER 280 GSM',
        price: 24000,
        description: 'Order type for flow test',
      })
      .expect(201);

    const customerRes = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        address: '27th Street',
        contact: '+6212345',
        email: 'john@doe.test',
        description: 'Flow test customer',
      })
      .expect(201);

    const orderRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        date: new Date().toISOString(),
        customer: customerRes.body.name,
        description: 'Flow test order',
        orderDetails: [
          {
            name: 'FLEXY BANNER 280 GSM',
            price: 24000,
            width: 200,
            height: 100,
            qty: 2,
            design: 1,
            eyelets: false,
            shiming: false,
            description: 'Flow detail',
          },
        ],
      })
      .expect(201);

    const listRes = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.find((o) => o.id === orderRes.body.id)).toBeTruthy();
  });
});
