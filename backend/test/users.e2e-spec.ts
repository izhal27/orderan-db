import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import * as request from 'supertest';


import { AppModule } from './../src/app.module';
import { UsersModule } from './../src/users/users.module';

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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule, PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);

    await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE; `;
  }, 30000);

  afterEach(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  describe('Users', () => {
    beforeEach(async () => {
      await prismaClient.role.upsert({
        where: { name: 'Role-1' },
        update: {},
        create: { name: 'Role-1', description: 'Description Role-1' },
      });
    });
    afterEach(async () => {
      await prismaClient.$executeRaw`TRUNCATE "public"."User"; `;
    }, 30000);

    describe('create user', () => {
      it('should throw error 400 when missing fields', async () => {
        const res = await request(app.getHttpServer())
          .post('/users/')
          .send({})
          .expect(400);
        expect(res.body?.statusCode).toEqual(400);
      });

      it('should throw error 409 when duplicate entry', async () => {
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

      it.skip('should create a user', async () => {
        const res = await request(app.getHttpServer())
          .post('/users/')
          .send(user)
          .expect(201);
        const newRole = await res.body;

        expect(user.username).toEqual(newRole.username);
        expect(user.email).toEqual(newRole.email);
        expect(user.roleId).toEqual(newRole.roleId);
      });
    });

    describe('read user', () => {
      it('should throw error 400 when search input wrong', async () => {
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
          .get(`/users/${newRole.id} `)
          .expect(200);
        expect(res.body).toEqual(newRole);
      });

      it('should throw error 404 when user not found', async () => {
        const res = await request(app.getHttpServer())
          .get('/users/1')
          .expect(404);
        expect(res.body?.statusCode).toEqual(404);
      });
    });

    describe('update user', () => {
      it('should throw error 400 when search input wrong', async () => {
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

        await request(app.getHttpServer())
          .patch(`/users/${newRole.id} `)
          .send({ ...user, username: '' })
          .expect(400);
        await request(app.getHttpServer())
          .patch(`/users/${newRole.id} `)
          .send({ ...user, email: '' })
          .expect(400);
        await request(app.getHttpServer())
          .patch(`/users/${newRole.id} `)
          .send({ ...user, password: '' })
          .expect(400);
        await request(app.getHttpServer())
          .patch(`/users/${newRole.id} `)
          .send({ ...user, roleId: '' })
          .expect(400);
      });

      it('should throw error 404 when user not found', async () => {
        const res = await request(app.getHttpServer())
          .patch('/users/1000')
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

        const updateUser = {
          username: 'A updated username',
          email: 'updated@email.com',
          name: 'A updated name',
        };

        const res = await request(app.getHttpServer())
          .patch(`/users/${newUser.id} `)
          .send(updateUser)
          .expect(200);
        expect(res.body.username).toEqual(updateUser.username);
        expect(res.body.email).toEqual(updateUser.email);
        expect(res.body.name).toEqual(updateUser.name);
      });
    });

    describe('delete user', () => {
      it('should throw error 404 when user not found', async () => {
        const res = await request(app.getHttpServer())
          .delete('/users/1')
          .expect(404);
        expect(res.body?.statusCode).toEqual(404);
      });

      it('should return a user', async () => {
        const resPost = await request(app.getHttpServer())
          .post('/users/')
          .send(user)
        // .expect(201);
        const newUser = await resPost.body;
        console.log(newUser);

        const res = await request(app.getHttpServer())
          .delete(`/users/${newUser.id} `)
          .expect(200);

        expect(res.body).toEqual(newUser);
      });
    });
  });
});
