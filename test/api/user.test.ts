import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { testConfig } from '../test-config';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userToken = testConfig.jwtToken;
  });

  it('/user/{id}(GET)', async () => {
    const userId = testConfig.userId;
    const response = await request(app.getHttpServer())
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(new RegExp(/"statusCode":200,"data":{.*}/));

    expect(response.body.data.id).toBe(userId);
    expect(response.body.data.password).toBeUndefined();
  });

  it('/user/me (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(new RegExp(/"statusCode":200,"data":{.*}/));

    expect(response.body.data.id).toBe(testConfig.userId);
    expect(response.body.data.password).toBeUndefined();
  });

  it('/user (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(new RegExp(/"statusCode":200,"data":\[.*]/));

    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].password).toBeUndefined();
  });

  it('/user (POST)', async () => {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      name: faker.person.firstName(),
      password: faker.internet.password(),
    };
    const response = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${userToken}`)
      .send(user)
      .expect(201)
      .expect(new RegExp(/"statusCode":201,"data":{.*}/));

    expect(response.body.data.username).toBe(user.username);
    expect(response.body.data.password).toBeUndefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
