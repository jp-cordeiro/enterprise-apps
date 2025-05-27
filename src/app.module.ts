import { Module } from '@nestjs/common';
import { ContentManagementService } from './core/services/content-management.service';
import { MediaPlayerService } from './core/services/media-player.service';
import { ContentRepository } from './persistence/repositories/content.repository';
import { VideoRepository } from './persistence/repositories/video.repository';
import { MediaPlayerController } from './http/rest/controllers/media-player.controller';
import { PersistenceModule } from './persistence/persistence.module';
import { VideoUploadController } from './http/rest/controllers/video-upload.controller';
import { ExternalMovieRatingClient } from './http/rest/client/external-movie-rating/external-movie-rating.client';
import { HttpClient } from './infra/http/client/http.client';
import { ConfigModule } from './infra/module/config/config.module';

@Module({
  imports: [PersistenceModule.forRoot(), ConfigModule.forRoot()],
  controllers: [VideoUploadController, MediaPlayerController],
  providers: [
    ContentManagementService,
    MediaPlayerService,
    ContentRepository,
    VideoRepository,
    ExternalMovieRatingClient,
    HttpClient,
  ],
})
export class AppModule {}
