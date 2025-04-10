import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  setupE2ETest,
  teardownE2ETest,
  generateDummyUser,
  url,
  expectUserMatch,
} from './utils';

describe('UsersController -- Create (e2e)', () => {
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

  it('should return 409 if user already exists', async () => {
    await post({
      username: 'default',
      password: '12345',
    }).expect(201);
    await post({
      username: 'default',
      password: '12345',
    }).expect(409);
  });

  it('should create a user', async () => {
    const { fake, res } = await generateDummyUser(app, accessToken);
    expectUserMatch(res.body, fake);
  });
});
