import { Injectable } from '@nestjs/common';
import { VideoNotFoundException } from '../exceptions/video-not-found.exception';
import { VideoRepository } from '@contentModule/persistence/repositories/video.repository';

@Injectable()
export class MediaPlayerService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async prepareStreaming(videoId: string) {
    const video = await this.videoRepository.findOneById(videoId);
    if (!video) {
      throw new VideoNotFoundException(`Video with ID ${videoId} not found`);
    }
    return video.url;
  }
}
