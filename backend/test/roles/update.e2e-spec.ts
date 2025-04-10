import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { setupE2ETest, teardownE2ETest, generateDummyRole, url } from './utils';

describe('RolesController -- Update (e2e)', () => {
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

  it('should return 400 for invalid ID', async () => {
    await patch('/a', {}).expect(400);
  });

  it('should return 404 for non-existing ID', async () => {
    await patch('/99999', { name: 'xxxxx' }).expect(404);
  });

  it('should update a role', async () => {
    const { res } = await generateDummyRole(app, accessToken);
    const update = {
      name: 'UPDATED',
      description: faker.lorem.words(),
    };
    const result = await patch(`/${res.body.id}`, update).expect(200);
    expect(result.body.name).toBe(update.name);
    expect(result.body.description).toBe(update.description);
  });
});
