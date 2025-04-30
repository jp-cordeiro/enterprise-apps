import { Module } from '@nestjs/common';
import { ContentManagementService } from './core/services/content-management.service';
import { ContentController } from './http/rest/controllers/content.controller';
import { MediaPlayerService } from './core/services/media-player.service';
import { PrismaService } from './persistence/prisma/prisma.service';
import { ContentRepository } from './persistence/repositories/content.repository';

@Module({
  imports: [],
  controllers: [ContentController],
  providers: [
    ContentManagementService,
    MediaPlayerService,
    PrismaService,
    ContentRepository,
  ],
})
export class AppModule {}
