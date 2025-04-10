import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import {
  expectUserMatch,
  generateDummyUser,
  setupE2ETest,
  teardownE2ETest,
  url,
} from './utils';

describe('UsersController -- Update (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    ({ accessToken, app } = await setupE2ETest());
  });

  afterAll(async () => await teardownE2ETest());

  const patch = (path: string, data: any) =>
    request(app.getHttpServer())
      .patch(`${url}${path}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data);

  it('should return 400 for invalid id', async () => {
    await patch('/a', {}).expect(400);
  });

  it('should return 404 for non-existent id', async () => {
    await patch('/99999', { name: 'xxxxx' }).expect(404);
  });

  it('should update a user', async () => {
    const { res } = await generateDummyUser(app, accessToken);
    const update = {
      username: 'USERNAMEUPDATED',
      name: 'NAMEUPDATED',
      email: 'email_update@gmail.com',
      image: '/updated-image',
    };
    const result = await patch(`/${res.body.id}`, update).expect(200);
    expectUserMatch(result.body, update);
  });
});
