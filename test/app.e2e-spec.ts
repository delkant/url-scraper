import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const targetURL = 'http://mockedURL.com';
  const timestamp = Date.parse('10/17/2022');
  const aDay = new Date(timestamp);

  const mockReferenceEntity = {
    id: 'mockedUUID',
    create_at: aDay,
    url: targetURL,
    results: [],
  };

  const mockResultEntity = {
    id: 'mockedUUID',
    reference: mockReferenceEntity,
    create_at: aDay,
    data: {},
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to Vizion API');
  });

  it('/references (POST)', () => {
    return request(app.getHttpServer())
      .post('/references')
      .send({ url: 'http://nestjs.com' })
      .expect(201);
  });

  it('/references (POST) invalid url', async () => {
    const response = await request(app.getHttpServer())
      .post('/references')
      .send({ url: 'http://invalid-url-no-dot-com' });

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual(['Please enter a valid URL']);
  });
});
