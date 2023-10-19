import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { testConfig } from '../test-config';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signin (POST)', async () => {
    const email = testConfig.userEmail;
    const password = testConfig.userPassword;
    const response = await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send({ email, password })
      .expect(200);

    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });

  it('/auth/signin (POST) Wrong password', async () => {
    const email = testConfig.userEmail;
    const password = testConfig.userPassword + 'wrong';
    const response = await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send({ email, password })
      .expect(400);

    expect(response.body.data?.accessToken).toBeUndefined();
    expect(response.body.data?.refreshToken).toBeUndefined();
  });

  it('/auth/refresh (POST)', async () => {
    const email = testConfig.userEmail;
    const password = testConfig.userPassword;

    const signInResponse = await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send({ email, password })
      .expect(200);

    const refreshToken = signInResponse.body.data.refreshToken;

    const response = await request(app.getHttpServer())
      .post(`/auth/refresh`)
      .send({ refreshToken })
      .expect(200);

    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
