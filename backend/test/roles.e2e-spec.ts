import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp } from './setup.e2e';

describe('RolesController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  const url = '/roles';
  let accessToken = '';

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    await prismaClient.role.upsert({
      where: { name: 'default' },
      update: {},
      create: { name: 'default', description: 'Default Description' },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/local/signup')
      .send({ username: 'userrole', password: '12345' })
      .expect(201);
    accessToken = await res.body.access_token;
  }, 30000);

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  // <---------------- CREATE ---------------->
  describe('Create', () => {
    it('should throw error 400 when name is missing', async () => {
      await request(app.getHttpServer())
        .post(`${url}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should throw error 409 when duplicate entry', async () => {
      await request(app.getHttpServer())
        .post(`${url}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'default' })
        .expect(409);
    });

    it('should create a role', async () => {
      const {
        fakeName,
        fakeDesc,
        body: { name, description },
      } = await generateDummyRole();
      expect(name).toEqual(fakeName);
      expect(description).toEqual(fakeDesc);
    });
  });

  // <---------------- READ ---------------->
  describe('Read', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .get(`${url}/a`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 404 when role not found', async () => {
      await request(app.getHttpServer())
        .get(`${url}/1000`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return list of role', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const roles = await res.body;
      expect(roles).not.toBe(null);
      expect(roles).toBeInstanceOf(Array);
    });

    it('should return a role', async () => {
      const {
        fakeName,
        fakeDesc,
        body: { id },
      } = await generateDummyRole();
      const res = await request(app.getHttpServer())
        .get(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { name, description } = await res.body;
      expect(name).toEqual(fakeName);
      expect(description).toEqual(fakeDesc);
    });
  });

  // <---------------- UPDATE ---------------->
  describe('Update', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .patch(`${url}/a`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 400 when name is missing', async () => {
      const res = await request(app.getHttpServer())
        .post(`${url}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: faker.string.alphanumeric({ length: 5 }),
          description: 'This is a description',
        })
        .expect(201);
      const { id } = await res.body;
      await request(app.getHttpServer())
        .patch(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should throw error 404 when role not found', async () => {
      await request(app.getHttpServer())
        .patch(`${url}/1000`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });

    it('should return updated role', async () => {
      const updateRole = {
        name: 'updatedrole',
        description: faker.lorem.words(),
      };
      const {
        body: { id },
      } = await generateDummyRole();
      const res = await request(app.getHttpServer())
        .patch(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateRole)
        .expect(200);
      const { name, description } = await res.body;
      expect(name).toEqual(updateRole.name);
      expect(description).toEqual(updateRole.description);
    });
  });

  // <---------------- DELETE ---------------->
  describe('Delete', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .delete(`${url}/a`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 404 when role not found', async () => {
      await request(app.getHttpServer())
        .delete('/roles/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return a role', async () => {
      const {
        fakeName,
        fakeDesc,
        body: { id },
      } = await generateDummyRole();
      const res = await request(app.getHttpServer())
        .delete(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { name, description } = await res.body;
      expect(name).toEqual(fakeName);
      expect(description).toEqual(fakeDesc);
    });
  });

  async function generateDummyRole() {
    const fakeName = faker.string.alphanumeric({ length: 5 });
    const fakeDesc = faker.lorem.words();
    const postRes = await request(app.getHttpServer())
      .post(`${url}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: fakeName, description: fakeDesc })
      .expect(201);
    return { fakeName, fakeDesc, body: postRes.body };
  }
});
