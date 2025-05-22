import { Module } from '@nestjs/common';
import { ContentManagementService } from './core/services/content-management.service';
import { ContentController } from './http/rest/controllers/content.controller';
import { MediaPlayerService } from './core/services/media-player.service';
import { ContentRepository } from './persistence/repositories/content.repository';
import { VideoRepository } from './persistence/repositories/video.repository';
import { MediaPlayerController } from './http/rest/controllers/media-player.controller';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [PersistenceModule.forRoot()],
  controllers: [ContentController, MediaPlayerController],
  providers: [
    ContentManagementService,
    MediaPlayerService,
    ContentRepository,
    VideoRepository,
  ],
})
export class AppModule {}
