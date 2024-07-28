import { HttpAdapterHost } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import { AppModule } from '../src/app.module';
import { RolesModule } from '../src/roles/roles.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let accessToken;
  const user = {
    username: 'user1',
    password: 'aaa',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, RolesModule, PrismaClient],
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
      create: { name: 'Role-1', description: 'Description Role-1' },
    });
    await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE;`;
  }, 30000);

  afterAll(async () => {
    await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE;`;
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  describe('Unauthenticated', () => {
    it('GET: /roles - should return Unauthorized', async () => {
      await request(app.getHttpServer())
        .get('/roles')
        .expect(401);
    });

    it('GET: /users - should return Unauthorized', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });
  });

  describe('Authenticated', () => {
    it('POST: /auth/local/signup - should return tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/local/signup')
        .send(user)
        .expect(201);
      const { access_token, refresh_token } = await res.body;
      accessToken = access_token
      expect(access_token).not.toBeNull();
      expect(refresh_token).not.toBeNull();
    });

    it('POST: /auth/local/signin - should return tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/local/signin')
        .send(user)
        .expect(200);
      const { access_token, refresh_token } = await res.body;
      expect(access_token).not.toBeNull();
      expect(refresh_token).not.toBeNull();
    });

    it('GET: /roles - should return roles array', async () => {
      const res = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const roles = await res.body;
      expect(roles).not.toBeNull();
      expect(roles).toBeInstanceOf(Array);
    });

    it('GET: /users - should return users array', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const users = await res.body;
      expect(users).not.toBeNull();
      expect(users).toBeInstanceOf(Array);
    });
  });
});
