import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { rmSync } from 'fs';

describe('ContentController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2025-01-01'));
  });

  afterAll(async () => {
    module.close();
    rmSync('./uploads', { recursive: true, force: true });
  });

  describe('/content/video (POST)', () => {
    it('should upload a video ', async () => {
      const video = {
        title: 'Test Video',
        description: 'This is a test video',
        videoUrl: 'uploads/test.mp4',
      };

      await request(app.getHttpServer())
        .post('/content/video ')
        .attach('video', './test/fixtures/sample.mp4')
        .attach('thumbnail', './test/fixtures/sample.jpeg')
        .field('title', video.title)
        .field('description', video.description)
        .expect((response) => {
          expect(response.body).toMatchObject({
            title: video.title,
            description: video.description,
            url: expect.stringContaining('mp4'),
          });
        })
        .expect(HttpStatus.CREATED);
    });

    it('should throws an error when the thumbnail is not provided', async () => {
      const video = {
        title: 'Test Video',
        description: 'This is a test video',
        videoUrl: 'uploads/test.mp4',
      };

      await request(app.getHttpServer())
        .post('/content/video ')
        .attach('video', './test/fixtures/sample.mp4')
        .field('title', video.title)
        .field('description', video.description)
        .expect((response) => {
          expect(response.body).toMatchObject({
            message: 'Both video and thumbnail files are required',
            error: 'Bad Request',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not allow no mp4 files', async () => {
      const video = {
        title: 'Test Video',
        description: 'This is a test video',
        videoUrl: 'uploads/test.mp4',
      };

      await request(app.getHttpServer())
        .post('/content/video ')
        .attach('video', './test/fixtures/sample.mp3')
        .attach('thumbnail', './test/fixtures/sample.jpeg')
        .field('title', video.title)
        .field('description', video.description)
        .expect((response) => {
          expect(response.body).toMatchObject({
            message:
              'Invalid file type. Only video/mp4 and image/jpeg are supported.',
            error: 'Bad Request',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
