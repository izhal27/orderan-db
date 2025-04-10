import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  expectUserMatch,
  generateDummyUser,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('UsersController -- Read (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  const get = (path = '') =>
    request(app.getHttpServer())
      .get(`${url}${path}`)
      .set('Authorization', `Bearer ${accessToken}`);

  it('should return 400 for invalid id', async () => {
    await get('/a').expect(400);
  });

  it('should return 404 for non-existent id', async () => {
    await get('/99999').expect(404);
  });

  it('should return list of users', async () => {
    const res = await get().expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return a single user', async () => {
    const { fake, res: createRes } = await generateDummyUser(app, accessToken);
    const res = await get(`/${createRes.body.id}`).expect(200);
    expectUserMatch(res.body, fake);
  });
});
