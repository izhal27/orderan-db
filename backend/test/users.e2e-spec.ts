import { INestApplication } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp } from './setup.e2e';
import { compareValue } from '../src/helpers/hash';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  const dummyUser = {
    username: 'dummy',
    password: '12345',
  };
  let role: Role;
  let accessToken = '';

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    const res = await request(app.getHttpServer())
      .post('/auth/local/signup')
      .send(dummyUser)
      .expect(201);
    accessToken = await res.body.access_token;
    const fakerName = faker.string.alphanumeric({ length: 5 });
    const fakerDesc = faker.lorem.words();
    role = await prismaClient.role.upsert({
      where: { name: fakerName },
      update: {},
      create: { name: fakerName, description: fakerDesc },
    });
  }, 3000);

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
    await prismaClient.$disconnect();
  });

  describe('Create', () => {
    it('should throw error 400 when username is missing', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...dummyUser, username: '' })
        .expect(400);
    });

    it('should throw error 400 when password is missing', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...dummyUser, password: '' })
        .expect(400);
    });

    it('should throw error 400 when email is wrong', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...dummyUser, email: 'testemail' })
        .expect(400);
    });

    it('should throw error 409 when duplicate entry', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dummyUser)
        .expect(409);
    });

    it('should create a user', async () => {
      const {
        fakeUsername,
        fakePass,
        body: { username, password },
      } = await generateDummyUser(app, accessToken);
      expect(username).toEqual(fakeUsername);
      expect(await compareValue(fakePass, password)).toEqual(true);
    });
  });

  describe('Read', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .get('/users/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 404 when user not found', async () => {
      await request(app.getHttpServer())
        .get('/users/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return list of users', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const users = await res.body;
      expect(users).not.toBe(null);
      expect(users).toBeInstanceOf(Array);
    });

    it('should return a user', async () => {
      const {
        fakeUsername,
        fakePass,
        body: { id },
      } = await generateDummyUser(app, accessToken);
      const res = await request(app.getHttpServer())
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { username, password } = await res.body;
      expect(username).toEqual(fakeUsername);
      expect(await compareValue(fakePass, password)).toEqual(true);
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
        .send({})
        .expect(404);
    });

    it('should return updated user', async () => {
      const updatedData = {
        username: faker.string.alphanumeric({ length: 5 }),
        name: faker.internet.displayName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.internet.url(),
        blocked: true,
        roleId: role.id,
      };
      const {
        body: { id },
      } = await generateDummyUser(app, accessToken);
      const res = await request(app.getHttpServer())
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedData)
        .expect(200);
      const { username, password, email, name, image, blocked, roleId } =
        await res.body;
      expect(username).toEqual(updatedData.username);
      expect(email).toEqual(updatedData.email);
      expect(name).toEqual(updatedData.name);
      expect(image).toEqual(updatedData.image);
      expect(blocked).toEqual(updatedData.blocked);
      expect(roleId).toEqual(updatedData.roleId);
      expect(await compareValue(updatedData.password, password)).toEqual(true);
    });
  });

  describe('Delete', () => {
    it('should throw error 400 when param input wrong', async () => {
      await request(app.getHttpServer())
        .delete('/users/a')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should throw error 404 when user not found', async () => {
      await request(app.getHttpServer())
        .delete('/users/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return a deleted user', async () => {
      const {
        body: { id, username: newUsername, password: newPassword },
      } = await generateDummyUser(app, accessToken);
      const res = await request(app.getHttpServer())
        .delete(`/users/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { username, password } = await res.body;
      expect(username).toEqual(newUsername);
      expect(password).toEqual(newPassword);
    });
  });
});

async function generateDummyUser(
  app: INestApplication<any>,
  accessToken: string,
) {
  const fakeUsername = faker.string.alphanumeric({ length: 5 });
  const fakePass = faker.internet.password();
  const postRes = await request(app.getHttpServer())
    .post('/users')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ username: fakeUsername, password: fakePass })
    .expect(201);
  return { fakeUsername, fakePass, body: postRes.body };
}
