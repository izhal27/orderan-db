import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { buildApp, truncateAll } from './utils';

describe('Orders Filter (e2e)', () => {
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

  it('should filter by date range and customer', async () => {
    const orderDetails = [
      {
        name: 'FILTER TYPE',
        price: 24000,
        width: 200,
        height: 100,
        qty: 2,
        design: 1,
        eyelets: false,
        shiming: false,
        description: 'Filter detail',
      },
    ];

    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        date: '2024-01-01T00:00:00.000Z',
        customer: 'ALPHA CUSTOMER',
        description: 'Order alpha',
        orderDetails,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        date: '2024-02-01T00:00:00.000Z',
        customer: 'BETA CUSTOMER',
        description: 'Order beta',
        orderDetails,
      })
      .expect(201);

    const filterRes = await request(app.getHttpServer())
      .get(
        '/orders/filter?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z&customer=ALPHA',
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(filterRes.body.data)).toBe(true);
    expect(filterRes.body.data.length).toBe(1);
    expect(filterRes.body.meta.total).toBe(1);
  });

  it('should paginate results', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders/filter?page=1&pageSize=1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.meta.total).toBeGreaterThan(0);
    expect(res.body.meta.pageSize).toBe(1);
    expect(res.body.data.length).toBe(1);
  });
});
