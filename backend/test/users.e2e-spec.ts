import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { PrismaClient } from '@prisma/client';
import { buildApp } from './setup.e2e';
import { compareValue } from 'src/helpers/hash';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let user: {
    id: number | null;
    username: string;
    password: string;
  } = {
    id: null,
    username: 'user1',
    password: '12345',
  };
  let accessToken = '';

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE;`;
    await prismaClient.role.upsert({
      where: { name: 'Role-1' },
      update: {},
      create: { name: 'Role-1', description: 'Description Role-1' },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/local/signup')
      .send(user)
      .expect(201);
    accessToken = await res.body.access_token;
  }, 3000);

  afterAll(async () => {
    await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE "public"."Role" RESTART IDENTITY CASCADE;`;
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

    it('should throw error 400 when password is missing', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...user, password: '' })
        .expect(400);
    });

    it('should throw error 400 when email is wrong', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...user, email: 'testemail' })
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
      user = await res.body;
      expect(user).not.toBeNull();
      expect(user.username).toEqual('user2');
    });
  });

  describe('Read', () => {
    it('POST: /users/a - should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .get('/users/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('POST: /users/1000 - should throw error 404 when user not found', async () => {
      await request(app.getHttpServer())
        .get('/users/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return list of users', async () => {
      const res = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const data = await res.body;
      expect(data).not.toBe(null);
      expect(data).toBeInstanceOf(Array);
    });

    it('should return a user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const data = await res.body;
      expect(data).not.toBeNull();
      expect(data.id).toEqual(user.id);
      expect(data.username).toEqual(user.username);
    });
  });

  describe('Update', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .patch('/users/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 404 when user not found', async () => {
      await request(app.getHttpServer())
        .patch('/users/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: {} })
        .expect(404);
    });

    it('should return updated user', async () => {
      const updateUser = {
        username: 'anotheruser',
        name: 'Updated user name',
        email: 'test@email.com',
        password: 'aaaaa',
        image: 'imagepath',
        blocked: true,
        roleId: 1,
      };
      const res = await request(app.getHttpServer())
        .patch('/users/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUser)
        .expect(200);
      const { username, password, email, name, image, blocked, roleId } =
        await res.body;
      console.log(JSON.stringify(await res.body, null, 4));
      expect(username).toEqual(updateUser.username);
      expect(email).toEqual(updateUser.email);
      expect(name).toEqual(updateUser.name);
      expect(image).toEqual(updateUser.image);
      expect(blocked).toEqual(updateUser.blocked);
      expect(roleId).toEqual(updateUser.roleId);
      expect(await compareValue(updateUser.password, password)).toEqual(true);
    });
  });
});
