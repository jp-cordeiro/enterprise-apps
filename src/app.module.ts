import { Module } from '@nestjs/common';
import { ContentManagementService } from './core/services/content-management.service';
import { ContentController } from './http/rest/controllers/content.controller';
import { MediaPlayerService } from './core/services/media-player.service';
import { PrismaService } from './persistence/prisma/prisma.service';
import { ContentRepository } from './persistence/repositories/content.repository';
import { VideoRepository } from './persistence/repositories/video.repository';
import { MediaPlayerController } from './http/rest/controllers/media-player.controller';
import { ConfigModule } from './infra/module/config/config.module';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ContentController, MediaPlayerController],
  providers: [
    ContentManagementService,
    MediaPlayerService,
    PrismaService,
    ContentRepository,
    VideoRepository,
  ],
})
export class AppModule {}
