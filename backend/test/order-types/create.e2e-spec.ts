import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  generateDummyOrderType,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('OrderTypesController -- Create (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  const post = (data: any) =>
    request(app.getHttpServer())
      .post(url)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data);

  it('should return 409 for duplicate name', async () => {
    await post({
      name: 'Order Type default',
      price: 1000,
      description: 'x',
    }).expect(201);
    await post({
      name: 'Order Type default',
      price: 1000,
      description: 'x',
    }).expect(409);
  });

  it('should create a new orderType', async () => {
    const { fake, res } = await generateDummyOrderType(app, accessToken);
    expect(res.body.name).toBe(fake.name);
    expect(res.body.price).toBe(fake.price);
    expect(res.body.description).toBe(fake.description);
  });
});
