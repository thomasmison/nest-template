import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userToken = 'TODO: Set user token here.';
  });

  it('/user/{id}(GET)', async () => {
    const userId = 'ca60cdee-eec4-4be1-be38-d9c481737781';
    const response = await request(app.getHttpServer())
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(new RegExp(/"statusCode":200,"data":{.*}/));

    expect(response.body.data.id).toBe(userId);
  });

  it('/user (GET)', () =>
    request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(new RegExp(/"statusCode":200,"data":\[.*]/)));

  afterAll(async () => {
    await app.close();
  });
});
