import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { PrismaClient } from '@prisma/client';
import { buildApp } from './setup.e2e';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  const user = {
    username: 'user1',
    password: '12345',
  };
  let accessToken = '';

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE;`;
    const res = await request(app.getHttpServer())
      .post('/auth/local/signup')
      .send(user)
      .expect(201);
    accessToken = await res.body.access_token;
  }, 3000);

  afterAll(async () => {
    await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE;`;
    await app.close();
    await prismaClient.$disconnect();
  });

  describe('Create', () => {
    it('should throw error 400 when username is missing', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...user, username: '' })
        .expect(400);
    });

    it('should throw error 409 when duplicate entry', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(user)
        .expect(409);
    });

    it('should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ username: 'user2', password: '12345' })
        .expect(201);
      const newUser = await res.body;
      expect(newUser).not.toBeNull();
      expect(newUser.username).toEqual('user2');
    });
  });
});
