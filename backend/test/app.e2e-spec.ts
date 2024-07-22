import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { RolesModule } from 'src/roles/roles.module';
import { PrismaClient } from '@prisma/client';
import { matchers } from 'jest-date/matchers'

expect.extend(matchers);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, RolesModule, PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);

    await prismaClient.$executeRaw`TRUNCATE "public"."Role" RESTART IDENTITY CASCADE;`;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  describe('Roles', () => {
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
