import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { UsersModule } from './../src/users/users.module';
import { PrismaClient } from '@prisma/client';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);
    await prismaClient.$executeRaw`TRUNCATE "public"."Role" RESTART IDENTITY CASCADE;`;
    await app.init();
  }, 3000);

  afterEach(async () => {
    //
  }, 3000);

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  });

  describe('GET: users/:id', () => {
    it('should return OK', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/1')
        .expect(200);
      const data = await res.body;
      expect(data).not.toBeNull();
    });
  });

  describe('POST: users/', () => {
    it('should return OK', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/')
        .send({ username: 'userrrrr', password: 'aaaaaaaaaaa' })
        .expect(201);
      const data = await res.body;
      expect(data).not.toBeNull();
    });
  });
});
