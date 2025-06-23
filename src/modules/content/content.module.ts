import { ContentManagementService } from '@contentModule/core/services/content-management.service';
import { MediaPlayerService } from '@contentModule/core/services/media-player.service';
import { ExternalMovieRatingClient } from '@contentModule/http/rest/client/external-movie-rating/external-movie-rating.client';
import { MediaPlayerController } from '@contentModule/http/rest/controllers/media-player.controller';
import { ConfigModule } from '@sharedModules/config/config.module';
import { PersistenceModule } from '@contentModule/persistence/persistence.module';
import { ContentRepository } from '@contentModule/persistence/repositories/content.repository';
import { VideoRepository } from '@contentModule/persistence/repositories/video.repository';
import { Module } from '@nestjs/common';
import { HttpClientModule } from '@sharedModules/http-client/http-client.module';
import { AdminMovieController } from './http/rest/controllers/admin-movie.controller';

@Module({
  imports: [
    PersistenceModule.forRoot(),
    ConfigModule.forRoot(),
    HttpClientModule,
  ],
  controllers: [AdminMovieController, MediaPlayerController],
  providers: [
    ContentManagementService,
    MediaPlayerService,
    ContentRepository,
    VideoRepository,
    ExternalMovieRatingClient,
  ],
})
export class ContentModule {}
