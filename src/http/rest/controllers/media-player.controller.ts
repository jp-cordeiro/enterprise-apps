import {
  Controller,
  Get,
  Header,
  HttpStatus,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import path from 'path';
import { createReadStream, statSync } from 'fs';
import type { Request, Response } from 'express';
import { MediaPlayerService } from '@src/core/services/media-player.service';
import { VideoNotFoundException } from '@src/core/exceptions/video-not-found.exception';

@Controller('stream')
export class MediaPlayerController {
  constructor(private readonly mediaPlayerService: MediaPlayerService) {}

  @Get(':videoId')
  @Header('Content-Type', 'video/mp4')
  async streamVideo(
    @Param('videoId') videoId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const url = await this.mediaPlayerService.prepareStreaming(videoId);
      if (!url) {
        return res.sendStatus(HttpStatus.NOT_FOUND);
      }

      const videoPath = path.join('.', url);
      const fileSize = statSync(videoPath).size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = createReadStream(videoPath, { start, end });
        res.writeHead(HttpStatus.PARTIAL_CONTENT, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        });
        return file.pipe(res);
      }
      res.writeHead(HttpStatus.OK, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
    } catch (error) {
      if (error instanceof VideoNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: error.message,
          error: 'Not Found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      throw error;
    }
  }
}
