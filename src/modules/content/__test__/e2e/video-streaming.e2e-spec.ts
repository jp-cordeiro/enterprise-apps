import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { rmSync } from 'fs';
import { ContentManagementService } from '@contentModule/core/services/content-management.service';
import { randomUUID } from 'crypto';
import { VideoRepository } from '@contentModule/persistence/repositories/video.repository';
import { ContentRepository } from '@contentModule/persistence/repositories/content.repository';
import { MovieRepository } from '@contentModule/persistence/repositories/movie.repository';
import nock from 'nock';

describe('ContentController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let contentManagementService: ContentManagementService;
  let videoRepository: VideoRepository;
  let contentRepository: ContentRepository;
  let movieRepository: MovieRepository;
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
    contentRepository = app.get<ContentRepository>(ContentRepository);
    movieRepository = app.get<MovieRepository>(MovieRepository);
  });

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2025-01-01'));
  });

  afterEach(async () => {
    await videoRepository.deleteAll();
    await movieRepository.deleteAll();
    await contentRepository.deleteAll();
    nock.cleanAll();
  });

  afterAll(async () => {
    module.close();
    rmSync('./uploads', { recursive: true, force: true });
  });

  const searchKeywordNock = (): void => {
    nock('https://api.themoviedb.org/3', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
      })
      .get('/search/keyword')
      .query({ query: 'Test Video', page: 1 })
      .reply(200, {
        results: [
          {
            id: '1',
          },
        ],
      });
  };
  const discorverMovieNock = (): void => {
    nock('https://api.themoviedb.org/3', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
      })
      .get('/discover/movie')
      .query({ with_keywords: 1 })
      .reply(200, {
        results: [
          {
            vote_average: 8,
          },
        ],
      });
  };

  describe('stream/:videoId', () => {
    it('should stream a video', async () => {
      searchKeywordNock();
      discorverMovieNock();

      const createMovie = await contentManagementService.createMovie({
        title: 'Test Video',
        description: 'This is a sample video.',
        url: './test/fixtures/sample.mp4',
        thumbnailUrl: './test/fixtures/sample.jpeg',
        sizeInKb: fileSize,
      });

      const range = `bytes=0-${fileSize - 1}`;

      const response = await request(app.getHttpServer())
        .get(`/stream/${createMovie.movie.video.id}`)
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
