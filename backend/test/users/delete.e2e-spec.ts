import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  expectUserMatch,
  generateDummyUser,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('UsersController -- Delete (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  const del = (path: string) =>
    request(app.getHttpServer())
      .delete(`${url}${path}`)
      .set('Authorization', `Bearer ${accessToken}`);

  it('should return 400 for invalid id', async () => {
    await del('/a').expect(400);
  });

  it('should return 404 for non-existent id', async () => {
    await del('/99999').expect(404);
  });

  it('should delete user and return it', async () => {
    const { fake, res } = await generateDummyUser(app, accessToken);
    const result = await del(`/${res.body.id}`).expect(200);
    expectUserMatch(res.body, fake);
  });
});
