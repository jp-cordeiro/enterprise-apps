import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { rmSync } from 'fs';
import { ContentManagementService } from '@src/core/services/content-management.service';
import { randomUUID } from 'crypto';
import { VideoRepository } from '@src/persistence/repositories/video.repository';

describe('ContentController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let contentManagementService: ContentManagementService;
  let videoRepository: VideoRepository;
  const fileSize = 1430145;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    contentManagementService = module.get<ContentManagementService>(
      ContentManagementService,
    );
    videoRepository = app.get<VideoRepository>(VideoRepository);
  });

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2025-01-01'));
  });

  afterEach(async () => {
    await videoRepository.deleteAll();
  });

  afterAll(async () => {
    module.close();
    rmSync('./uploads', { recursive: true, force: true });
  });

  describe('stream/:videoId', () => {
    it('should stream a video', async () => {
      const createContent = await contentManagementService.createContent({
        title: 'Sample Video',
        description: 'This is a sample video.',
        url: './test/fixtures/sample.mp4',
        thumbnailUrl: './test/fixtures/sample.jpeg',
        sizeInKb: fileSize,
      });

      const range = `bytes=0-${fileSize - 1}`;

      const response = await request(app.getHttpServer())
        .get(`/stream/${createContent.getMedia()?.getVideo()?.getId()}`)
        .set('Range', range)
        .expect(HttpStatus.PARTIAL_CONTENT);

      expect(response.headers['content-range']).toBe(
        `bytes 0-${fileSize - 1}/${fileSize}`,
      );
      expect(response.headers['accept-ranges']).toBe('bytes');
      expect(response.headers['content-length']).toBe(fileSize.toString());
      expect(response.headers['content-type']).toBe('video/mp4');
    });

    it('should returns 404 if the video is not found', async () => {
      await request(app.getHttpServer())
        .get(`/stream/${randomUUID()}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
