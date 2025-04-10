import { accessToken } from './../roles/utils';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export const login = async (
  app: INestApplication,
  username: string,
  password: string,
): Promise<{ accessToken: string }> => {
  const res = await request(app.getHttpServer())
    .post('/auth/local/signin')
    .send({ username, password })
    .expect(200);
  return { accessToken: res.body.access_token };
};

export const signup = async (app: INestApplication) => {
  const res = await request(app.getHttpServer())
    .post('/auth/local/signup')
    .send({
      username: Math.random().toString(36).substring(2, 8),
      password: 'password123',
    })
    .expect(201);
  return res.body;
};
