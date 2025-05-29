import { Injectable } from '@nestjs/common';
import { Content } from '@contentModule/persistence/entities/content.entity';
import { ContentRepository } from '@contentModule/persistence/repositories/content.repository';
import { CONTENT_TYPE } from '../enums/content-type.enum';
import { Movie } from '@contentModule/persistence/entities/movie.entity';
import { Video } from '@contentModule/persistence/entities/video.entity';
import { Thumbnail } from '@contentModule/persistence/entities/thumbnail.entity';
import { ExternalMovieRatingClient } from '@contentModule/http/rest/client/external-movie-rating/external-movie-rating.client';

export interface CreateMovieData {
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  sizeInKb: number;
}

@Injectable()
export class ContentManagementService {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly externalMovieRatingClient: ExternalMovieRatingClient,
  ) {}

  async createMovie(createMovieData: CreateMovieData): Promise<Content> {
    const externalRating = await this.externalMovieRatingClient.getRating(
      createMovieData.title,
    );
    const contentEntity = new Content({
      title: createMovieData.title,
      description: createMovieData.description,
      type: CONTENT_TYPE.MOVIE,
      movie: new Movie({
        externalRating,
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
