import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import path from 'path';
import type { Request } from 'express';
import { ContentManagementService } from '@contentModule/core/services/content-management.service';
import { MediaPlayerService } from '@contentModule/core/services/media-player.service';
import { CreateVideoResponseDto } from '../dtos/response/create-video-response.dto';
import { RestResponseInterceptor } from '../interceptors/rest-response.interceptor';

@Controller('admin')
export class AdminMovieController {
  constructor(
    private readonly contentManagementService: ContentManagementService,
    private readonly mediaPlayerService: MediaPlayerService,
  ) {}

  @Post('movie')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      {
        dest: './uploads',
        storage: diskStorage({
          destination: './uploads',
          filename: (_req, file, cb) => {
            return cb(
              null,
              `${Date.now()}-${randomUUID()}${path.extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (_req, file, cb) => {
          if (file.mimetype !== 'video/mp4' && file.mimetype !== 'image/jpeg') {
            return cb(
              new BadRequestException(
                'Invalid file type. Only video/mp4 and image/jpeg are supported.',
              ),
              false,
            );
          }
          return cb(null, true);
        },
      },
    ),
  )
  @UseInterceptors(new RestResponseInterceptor(CreateVideoResponseDto))
  async uploadMovie(
    @Req() _req: Request,
    @Body() contentData: { title: string; description: string },
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ): Promise<CreateVideoResponseDto> {
    const videoFile = files.video?.[0];
    const thumbnailFile = files.thumbnail?.[0];
    if (!videoFile || !thumbnailFile) {
      throw new BadRequestException(
        'Both video and thumbnail files are required',
      );
    }
    const MAX_FILE_SIZE = 1024 * 1024 * 1024;
    if (videoFile.size > MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds the limit`);
    }
    const MAX_THUMBNAIL_SIZE = 1024 * 1024 * 10;
    if (thumbnailFile.size > MAX_THUMBNAIL_SIZE) {
      throw new BadRequestException(`Thumbnail size exceeds the limit`);
    }

    const createdMovie = await this.contentManagementService.createMovie({
      title: contentData.title,
      description: contentData.description,
      url: videoFile.path,
      thumbnailUrl: thumbnailFile.path,
      sizeInKb: videoFile.size,
    });
    const contentResponse: CreateVideoResponseDto = {
      id: createdMovie.id,
      title: createdMovie.title,
      description: createdMovie.description,
      url: createdMovie.movie.video.url,
      thumbnailUrl: createdMovie.movie.thumbnail?.url,
      sizeInKb: createdMovie.movie.video.sizeInKb,
      duration: createdMovie.movie.video.duration,
      createdAt: createdMovie.createdAt,
      updatedAt: createdMovie.updatedAt,
    };
    return contentResponse;
  }
}
