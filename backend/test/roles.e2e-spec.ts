import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { RolesModule } from './../src/roles/roles.module';

const role = {
  name: 'Role 1',
  description: 'This is a description',
};

describe('RolesController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, RolesModule, PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);
    await prismaClient.$executeRaw`TRUNCATE "public"."Role" RESTART IDENTITY CASCADE;`;
  }, 30000);

  afterEach(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  describe('Roles', () => {
    beforeEach(async () => {
      await prismaClient.$executeRaw`TRUNCATE "public"."Role" RESTART IDENTITY CASCADE;`;
    }, 30000);

    describe('create role', () => {
      it('should throw error 400 when missing fields', async () => {
        const res = await request(app.getHttpServer())
          .post('/roles/')
          .send({ role: {} })
          .expect(400);
        expect(res.body?.statusCode).toEqual(400);
      });

      it('should throw error 409 when duplicate entry', async () => {
        await request(app.getHttpServer())
          .post('/roles/')
          .send(role)
          .expect(201);

        const res = await request(app.getHttpServer())
          .post('/roles/')
          .send(role)
          .expect(409);
        expect(res.body?.statusCode).toEqual(409);
      });

      it('should create a role', async () => {
        const res = await request(app.getHttpServer())
          .post('/roles/')
          .send(role)
          .expect(201);
        const newRole = await res.body;

        expect(role.name).toEqual(newRole.name);
        expect(role.description).toEqual(newRole.description);
      });
    });

    describe('read role', () => {
      it('should throw error 400 when search input wrong', async () => {
        const res = await request(app.getHttpServer())
          .get('/roles/a')
          .expect(400);
        expect(res.body?.statusCode).toEqual(400);
      });

      it('should return a role', async () => {
        const resPost = await request(app.getHttpServer())
          .post('/roles/')
          .send(role)
          .expect(201);
        const newRole = await resPost.body;

        const res = await request(app.getHttpServer())
          .get(`/roles/${newRole.id}`)
          .expect(200);
        expect(res.body).toEqual(newRole);
      });

      it('should throw error 404 when role not found', async () => {
        const res = await request(app.getHttpServer())
          .get('/roles/1000')
          .expect(404);
        expect(res.body?.statusCode).toEqual(404);
      });
    });

    describe('update role', () => {
      it('should throw error 400 when search input wrong', async () => {
        const res = await request(app.getHttpServer())
          .patch('/roles/a')
          .expect(400);
        expect(res.body?.statusCode).toEqual(400);
      });

      it('should throw error 400 when missing fields', async () => {
        const resPost = await request(app.getHttpServer())
          .post('/roles/')
          .send(role)
          .expect(201);
        const newRole = await resPost.body;

        const res = await request(app.getHttpServer())
          .patch(`/roles/${newRole.id}`)
          .send({ name: '' })
          .expect(400);
        expect(res.body?.statusCode).toEqual(400);
      });

      it('should throw error 404 when role not found', async () => {
        const res = await request(app.getHttpServer())
          .patch('/roles/1000')
          .send({ role: {} })
          .expect(404);
        expect(res.body?.statusCode).toEqual(404);
      });

      it('should return updated role', async () => {
        const resPost = await request(app.getHttpServer())
          .post('/roles/')
          .send(role)
          .expect(201);
        const newUser = await resPost.body;

        const updateRole = {
          name: 'A updated name',
          description: 'A updated description',
        };

        const res = await request(app.getHttpServer())
          .patch(`/roles/${newUser.id}`)
          .send(updateRole)
          .expect(200);
        expect(res.body.name).toEqual(updateRole.name);
        expect(res.body.description).toEqual(updateRole.description);
      });
    });

    describe('delete role', () => {
      it('should throw error 404 when role not found', async () => {
        const res = await request(app.getHttpServer())
          .delete('/roles/1')
          .expect(404);
        expect(res.body?.statusCode).toEqual(404);
      });

      it('should return a role', async () => {
        const resPost = await request(app.getHttpServer())
          .post('/roles/')
          .send(role)
          .expect(201);
        const newRole = await resPost.body;

        const res = await request(app.getHttpServer())
          .delete(`/roles/${newRole.id}`)
          .expect(200);
        expect(res.body).toEqual(newRole);
      });
    });
  });
});
