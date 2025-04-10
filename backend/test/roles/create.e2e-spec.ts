import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { setupE2ETest, teardownE2ETest, generateDummyRole, url } from './utils';

describe('RolesController -- Create (e2e)', () => {
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

  it('should return 409 if role already exists', async () => {
    await post({
      name: 'Default',
      description: 'x',
    }).expect(201);
    await post({
      name: 'Default',
      description: 'x',
    }).expect(409);
  });

  it('should create a role', async () => {
    const { fake, res } = await generateDummyRole(app, accessToken);
    expect(res.body.name).toBe(fake.name);
    expect(res.body.description).toBe(fake.description);
  });
});
