import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmPersistenceModule } from '@src/infra/module/typeorm/typeorm-persinstense.module';
import { Content } from './entities/content.entity';
import { Movie } from './entities/movie.entity';
import { Thumbnail } from './entities/thumbnail.entity';
import { Video } from './entities/video.entity';
import { TvShow } from './entities/tv-show.entity';
import { Episode } from './entities/episode.entity';
import { ContentRepository } from './repositories/content.repository';
import { MovieRepository } from './repositories/movie.repository';
import { EpisodeRepository } from './repositories/episode.repository';
import { ThumbnailRepository } from './repositories/thumbnail.repository';
import { TvShowRepository } from './repositories/tv-show.repository';
import { VideoRepository } from './repositories/video.repository';

@Module({})
export class PersistenceModule {
  static forRoot(options?: { migrations?: string[] }): DynamicModule {
    const { migrations } = options || {};
    return {
      module: PersistenceModule,
      imports: [
        TypeOrmPersistenceModule.forRoot({
          migrations,
          entities: [Content, Movie, Thumbnail, Video, TvShow, Episode],
        }),
      ],
      providers: [
        ContentRepository,
        MovieRepository,
        EpisodeRepository,
        ThumbnailRepository,
        TvShowRepository,
        VideoRepository,
      ],
      exports: [
        ContentRepository,
        MovieRepository,
        EpisodeRepository,
        ThumbnailRepository,
        TvShowRepository,
        VideoRepository,
      ],
    };
  }
}
