import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup-app';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app); 
    await app.init();
  }, 15000); 

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('handles a signup request', async () => {
  const email = `test${Date.now()}@test.com`;
  const password = '1234';

  try {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password });

    console.log(' Status:', res.statusCode);
    console.log('Response Body:', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.email).toEqual(email);

  } catch (err: any) {
    if (err.response) {
      console.log('Status:', err.response.status);
      console.log(' Response Body:', err.response.text || err.response.body);
    } else {
      console.log('Unexpected error:', err.message);
    }
    throw err; 
  }
});

});
