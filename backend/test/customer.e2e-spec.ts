import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { buildApp } from './setup.e2e';

jest.setTimeout(70 * 1000);

describe('CustomersController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  const url = '/customers';
  let accessToken = '';

  beforeAll(async () => {
    ({ app, prismaClient } = await buildApp());
    await prismaClient.customer.upsert({
      where: { name: 'default' },
      update: {},
      create: { name: 'default', description: 'Default Description' },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/local/signin')
      .send({ username: 'admin', password: '12345' })
      .expect(200);
    accessToken = await res.body.access_token;
  }, 30000);

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  // <---------------- CREATE ---------------->
  describe('Create', () => {
    it('should throw error 400 when name is missing', async () => {
      await request(app.getHttpServer())
        .post(`${url}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should not throw error 409 when duplicate entry', async () => {
      await request(app.getHttpServer())
        .post(`${url}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'default' })
        .expect(201);

      await request(app.getHttpServer())
        .post(`${url}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'default' })
        .expect(201);
    });

    it('should create a customer', async () => {
      const {
        fakeName,
        fakeAddress,
        fakeContact,
        fakeEmail,
        fakeDesc,
        body: { name, description, address, contact, email },
      } = await generateDummyRole();
      expect(name).toEqual(fakeName);
      expect(address).toEqual(fakeAddress);
      expect(contact).toEqual(fakeContact);
      expect(email).toEqual(fakeEmail);
      expect(description).toEqual(fakeDesc);
    });
  });

  // <---------------- READ ---------------->
  describe('Read', () => {
    it('should throw error 404 when customer not found', async () => {
      await request(app.getHttpServer())
        .get(`${url}/1000`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return list of customer', async () => {
      const res = await request(app.getHttpServer())
        .get(`${url}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const roles = await res.body;
      expect(roles).not.toBe(null);
      expect(roles).toBeInstanceOf(Array);
    });

    it('should return a customer', async () => {
      const {
        fakeName,
        fakeDesc,
        fakeAddress,
        fakeContact,
        fakeEmail,
        body: { id },
      } = await generateDummyRole();
      const res = await request(app.getHttpServer())
        .get(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { name, address, contact, email, description } = await res.body;
      expect(name).toEqual(fakeName);
      expect(address).toEqual(fakeAddress);
      expect(contact).toEqual(fakeContact);
      expect(email).toEqual(fakeEmail);
      expect(description).toEqual(fakeDesc);
    });
  });

  // <---------------- UPDATE ---------------->
  describe('Update', () => {
    it('should throw error 400 when name is missing', async () => {
      const res = await request(app.getHttpServer())
        .post(`${url}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: faker.string.alphanumeric({ length: 5 }),
          description: 'This is a description',
        })
        .expect(201);
      const { id } = await res.body;
      await request(app.getHttpServer())
        .patch(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' })
        .expect(400);
    });

    it('should throw error 404 when customer not found', async () => {
      await request(app.getHttpServer())
        .patch(`${url}/1000`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });

    it('should return updated customer', async () => {
      const updateRole = {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        contact: faker.phone.number(),
        email: faker.internet.email(),
        description: faker.lorem.words(),
      };
      const {
        body: { id },
      } = await generateDummyRole();
      const res = await request(app.getHttpServer())
        .patch(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateRole)
        .expect(200);
      const { name, address, contact, email, description } = await res.body;
      expect(name).toEqual(updateRole.name);
      expect(address).toEqual(updateRole.address);
      expect(contact).toEqual(updateRole.contact);
      expect(email).toEqual(updateRole.email);
      expect(description).toEqual(updateRole.description);
    });
  });

  // <---------------- DELETE ---------------->
  describe('Delete', () => {
    it('should throw error 404 when customer not found', async () => {
      await request(app.getHttpServer())
        .delete('/roles/1000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return a customer', async () => {
      const {
        fakeName,
        fakeDesc,
        fakeAddress,
        fakeContact,
        fakeEmail,
        body: { id },
      } = await generateDummyRole();
      const res = await request(app.getHttpServer())
        .delete(`${url}/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const { name, address, contact, email, description } = await res.body;
      expect(name).toEqual(fakeName);
      expect(address).toEqual(fakeAddress);
      expect(contact).toEqual(fakeContact);
      expect(email).toEqual(fakeEmail);
      expect(description).toEqual(fakeDesc);
    });
  });

  async function generateDummyRole() {
    const fakeName = faker.person.fullName();
    const fakeAddress = faker.location.streetAddress();
    const fakeContact = faker.phone.number();
    const fakeEmail = faker.internet.email();
    const fakeDesc = faker.lorem.words();
    const postRes = await request(app.getHttpServer())
      .post(`${url}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: fakeName,
        address: fakeAddress,
        contact: fakeContact,
        email: fakeEmail,
        description: fakeDesc,
      })
      .expect(201);
    return {
      fakeName,
      fakeAddress,
      fakeContact,
      fakeEmail,
      fakeDesc,
      body: postRes.body,
    };
  }
});
