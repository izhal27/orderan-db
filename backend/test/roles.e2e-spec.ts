import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';

import { buildApp } from './setup.e2e';

describe('RolesController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  const role = {
    name: 'Role 1',
    description: 'This is a description',
  };
  let accessToken = '';

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    await prismaClient.$executeRaw`TRUNCATE "public"."Role" RESTART IDENTITY CASCADE;`;
    const res = await request(app.getHttpServer())
      .post('/auth/local/signup')
      .send({ username: 'admin', password: '12345' })
      .expect(201);
    accessToken = await res.body.access_token;
  }, 30000);

  afterAll(async () => {
    await prismaClient.$executeRaw`TRUNCATE "public"."Role" RESTART IDENTITY CASCADE;`;
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  describe('Create', () => {
    it('should throw error 400 when name is missing', async () => {
      await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should throw error 409 when duplicate entry', async () => {
      const role = {
        name: 'Role 1',
        description: 'This is a description',
      };

      await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(role)
        .expect(201);

      await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(role)
        .expect(409);
    });

    it('should create a role', async () => {
      const role = {
        name: 'Role 2',
        description: 'This is a description',
      };

      const res = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(role)
        .expect(201);
      const newRole = await res.body;

      expect(role.name).toEqual(newRole.name);
      expect(role.description).toEqual(newRole.description);
    });
  });

  describe('Read', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .get('/roles/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 404 when role not found', async () => {
      await request(app.getHttpServer())
        .get('/roles/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return a role', async () => {
      const res = await request(app.getHttpServer())
        .get('/roles/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const data = await res.body;
      expect(data.name).toEqual(role.name);
      expect(data.description).toEqual(role.description);
    });
  });

  describe('Update', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .patch('/roles/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 400 when name is missing', async () => {
      await request(app.getHttpServer())
        .patch('/roles/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should throw error 404 when role not found', async () => {
      await request(app.getHttpServer())
        .patch('/roles/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: {} })
        .expect(404);
    });

    it('should return updated role', async () => {
      const updateRole = {
        name: 'A updated name',
        description: 'A updated description',
      };
      const res = await request(app.getHttpServer())
        .patch('/roles/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateRole)
        .expect(200);
      const data = await res.body;
      expect(data.name).toEqual(updateRole.name);
      expect(data.description).toEqual(updateRole.description);
    });
  });

  describe('Delete', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .delete('/roles/a')
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
      const getRes = await request(app.getHttpServer())
        .get('/roles/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const role = await getRes.body;
      const res = await request(app.getHttpServer())
        .delete(`/roles/${role.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const data = await res.body;
      expect(data).toEqual(role);
    });
  });
});
