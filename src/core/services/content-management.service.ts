import { Injectable } from '@nestjs/common';
import { ContentEntity, ContentType } from '../entities/content.entity';
import { MovieEntity } from '../entities/movie.entity';
import { VideoEntity } from '../entities/video.entity';
import { ThumbnailEntity } from '../entities/thumbnail.entity';
import { ContentRepository } from '@src/persistence/repositories/content.repository';

export interface CreateContentData {
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  sizeInKb: number;
}

@Injectable()
export class ContentManagementService {
  constructor(private readonly contentRepository: ContentRepository) {}

  async createContent(
    createContentData: CreateContentData,
  ): Promise<ContentEntity> {
    const content = ContentEntity.createNew({
      title: createContentData.title,
      description: createContentData.description,
      type: ContentType.MOVIE,
      media: MovieEntity.createNew({
        video: VideoEntity.createNew({
          url: createContentData.url,
          sizeInKb: createContentData.sizeInKb,
          duration: 100,
        }),
        thumbnail: ThumbnailEntity.createNew({
          url: createContentData.thumbnailUrl,
        }),
      }),
    });

    const createdVideo = await this.contentRepository.create(content);
    return createdVideo;
  }
}
