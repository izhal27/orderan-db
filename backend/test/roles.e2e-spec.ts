import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RolesModule } from 'src/roles/roles.module';
import { PrismaClient } from '@prisma/client';
import { matchers } from 'jest-date/matchers'
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

expect.extend(matchers);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

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
    await prismaClient.$executeRaw`TRUNCATE "public"."Role" RESTART IDENTITY CASCADE;`;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  describe('Roles', () => {
    it('should throw error when missing fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/roles/')
        .send({ role: {} })
        .expect(400);
      expect(response.body?.statusCode).toEqual(400);
    });

    afterEach(async () => {
      await prismaClient.$executeRaw`TRUNCATE "public"."Role" RESTART IDENTITY CASCADE;`;
    }, 30000);

    it('should throw error when duplicate entry', async () => {
      const role = {
        name: 'Role 1',
        description: 'This is a description'
      };

      await request(app.getHttpServer())
        .post('/roles/')
        .send(role)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/roles/')
        .send(role)
        .expect(409);
      expect(response.body?.statusCode).toEqual(409);
    });

    it('should create a role', async () => {
      const role = {
        name: 'Role 1',
        description: 'This is a description'
      };

      const response = await request(app.getHttpServer())
        .post('/roles/')
        .send(role)
        .expect(201);

      delete response.body.createdAt;
      delete response.body.updatedAt;

      expect(response.body).toEqual({
        id: expect.any(Number),
        name: role.name,
        description: role.description
      });
    });
  });
});
