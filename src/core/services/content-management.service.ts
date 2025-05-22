import { Injectable } from '@nestjs/common';
import { Content } from '@src/persistence/entities/content.entity';
import { ContentRepository } from '@src/persistence/repositories/content.repository';
import { CONTENT_TYPE } from '../enums/content-type.enum';
import { Movie } from '@src/persistence/entities/movie.entity';
import { Video } from '@src/persistence/entities/video.entity';
import { Thumbnail } from '@src/persistence/entities/thumbnail.entity';

export interface CreateMovieData {
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  sizeInKb: number;
}

@Injectable()
export class ContentManagementService {
  constructor(private readonly contentRepository: ContentRepository) {}

  async createMovie(createMovieData: CreateMovieData): Promise<Content> {
    const contentEntity = new Content({
      title: createMovieData.title,
      description: createMovieData.description,
      type: CONTENT_TYPE.MOVIE,
      movie: new Movie({
        video: new Video({
          url: createMovieData.url,
          duration: 10,
          sizeInKb: createMovieData.sizeInKb,
        }),
      }),
    });
    if (createMovieData.thumbnailUrl) {
      contentEntity.movie.thumbnail = new Thumbnail({
        url: createMovieData.thumbnailUrl,
      });
    }
    const content = await this.contentRepository.save(contentEntity);
    return content;
  }
}
