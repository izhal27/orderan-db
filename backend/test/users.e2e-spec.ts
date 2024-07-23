import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import * as request from 'supertest';
import { matchers } from 'jest-date/matchers'

import { AppModule } from '../src/app.module';
import { UsersModule } from 'src/users/users.module';

expect.extend(matchers);

const user = {
  name: 'User 1',
  username: 'user',
  email: 'test@test.com',
  password: 'aaa',
  image: null,
  isBlocked: false,
  roleId: 1,
  refreshToken: null,
};

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule, PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);
    await prismaClient.role.upsert({
      where: { name: 'Role-1' },
      update: {},
      create: { name: 'Role-1', description: 'Description Role-1' }
    });
    await prismaClient.role.upsert({
      where: { name: 'Role-2' },
      update: {},
      create: { name: 'Role-2', description: 'Description Role-2' }
    });
    await prismaClient.role.upsert({
      where: { name: 'Role-3' },
      update: {},
      create: { name: 'Role-3', description: 'Description Role-3' }
    });

    await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE; `;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  describe('Users', () => {
    afterEach(async () => {
      await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE; `;
    }, 30000);

    describe('create user', () => {
      it('should throw error 400 when missing fields', async () => {
        const res = await request(app.getHttpServer())
          .post('/users/')
          .send({})
          .expect(400);
        expect(res.body?.statusCode).toEqual(400);
      });

      it.skip('should throw error 409 when duplicate entry', async () => {
        await request(app.getHttpServer())
          .post('/users/')
          .send(user)
          .expect(201);

        const res = await request(app.getHttpServer())
          .post('/users/')
          .send(user)
          .expect(409);
        expect(res.body?.statusCode).toEqual(409);
      });

      it('should create a user', async () => {
        const res = await request(app.getHttpServer())
          .post('/users/')
          .send(user)
          .expect(201);
        const newRole = await res.body;

        // expect(user.name).toEqual(newRole.name);
        // expect(user.description).toEqual(newRole.description);
      });
    });

    describe('read user', () => {
      it.skip('should throw error 400 when search input wrong', async () => {
        const res = await request(app.getHttpServer())
          .get('/users/a')
          .expect(400);
        expect(res.body?.statusCode).toEqual(400);
      });

      it.skip('should return a user', async () => {
        const resPost = await request(app.getHttpServer())
          .post('/users/')
          .send(user)
          .expect(201);
        const newRole = await resPost.body;

        const res = await request(app.getHttpServer())
          .get(`/ users / ${newRole.id} `)
          .expect(200);
        expect(res.body).toEqual(newRole);
      });

      it.skip('should throw error 404 when user not found', async () => {
        const res = await request(app.getHttpServer())
          .get('/users/1')
          .expect(404);
        expect(res.body?.statusCode).toEqual(404);
      });
    });

    describe('update user', () => {
      it.skip('should throw error 400 when search input wrong', async () => {
        const res = await request(app.getHttpServer())
          .patch('/users/a')
          .expect(400);
        expect(res.body?.statusCode).toEqual(400);
      });

      it.skip('should throw error 400 when missing fields', async () => {
        const resPost = await request(app.getHttpServer())
          .post('/users/')
          .send(user)
          .expect(201);
        const newRole = await resPost.body;

        const res = await request(app.getHttpServer())
          .patch(`/ users / ${newRole.id} `)
          .send({ name: '' })
          .expect(400);
        expect(res.body?.statusCode).toEqual(400);
      });

      it.skip('should throw error 404 when user not found', async () => {
        const res = await request(app.getHttpServer())
          .patch('/users/1')
          .send({ user: {} })
          .expect(404);
        expect(res.body?.statusCode).toEqual(404);
      });

      it.skip('should return updated user', async () => {
        const resPost = await request(app.getHttpServer())
          .post('/users/')
          .send(user)
          .expect(201);
        const newUser = await resPost.body;

        const updateRole = {
          name: 'A updated name',
          description: 'A updated description'
        }

        const res = await request(app.getHttpServer())
          .patch(`/ users / ${newUser.id} `)
          .send(updateRole)
          .expect(200);
        expect(res.body.name).toEqual(updateRole.name);
        expect(res.body.description).toEqual(updateRole.description);
      });
    });

    describe('delete user', () => {
      it.skip('should throw error 404 when user not found', async () => {
        const res = await request(app.getHttpServer())
          .delete('/users/1')
          .expect(404);
        expect(res.body?.statusCode).toEqual(404);
      });

      it.skip('should return a user', async () => {
        const resPost = await request(app.getHttpServer())
          .post('/users/')
          .send(user)
          .expect(201);
        const newRole = await resPost.body;

        const res = await request(app.getHttpServer())
          .delete(`/ users / ${newRole.id} `)
          .expect(200);
        expect(res.body).toEqual(newRole);
      });
    });
  });
});
