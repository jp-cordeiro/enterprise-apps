import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentEntity } from '@src/core/entities/content.entity';
import { Prisma } from '@prisma/client';
import { MovieEntity } from '@src/core/entities/movie.entity';
import { VideoEntity } from '@src/core/entities/video.entity';
import { ThumbnailEntity } from '@src/core/entities/thumbnail.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const contentInclude = Prisma.validator<Prisma.ContentInclude>()({
  Movie: {
    include: {
      Video: true,
      Thumbnail: true,
    },
  },
});
@Injectable()
export class ContentRepository {
  private readonly model: PrismaService['content'];

  constructor(prismaService: PrismaService) {
    this.model = prismaService.content;
  }

  async create(content: ContentEntity): Promise<ContentEntity> {
    try {
      const movie = content.getMedia();
      if (!movie) {
        throw new Error('Movie must be provided');
      }
      const video = movie.getVideo();
      await this.model.create({
        data: {
          id: content.getId(),
          title: content.getTitle(),
          description: content.getDescription(),
          type: content.getType(),
          Movie: {
            create: {
              id: movie.getId(),
              Video: {
                create: video.serialize(),
              },
              Thumbnail: {
                create: movie.getThumbnail()?.serialize(),
              },
            },
          },
          createdAt: content.getCreatedAt(),
          updatedAt: content.getUpdatedAt(),
        },
      });
      return content;
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async findById(id: string): Promise<ContentEntity | undefined> {
    try {
      const content = await this.model.findUnique({
        where: { id },
        include: {
          Movie: {
            include: {
              Video: true,
              Thumbnail: true,
            },
          },
        },
      });
      if (!content) {
        return;
      }
      return this.mapToEntity(content);
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  private mapToEntity<
    T extends Prisma.ContentGetPayload<{
      include: typeof contentInclude;
    }>,
  >(content: T | null): ContentEntity {
    if (!content || !content.Movie) {
      throw new Error(`Movie and video must be provided`);
    }
    const contentEntity = ContentEntity.createFrom({
      id: content.id,
      title: content.title,
      description: content.description,
      type: content.type,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    });
    if (this.isMovie(content) && content.Movie.Video) {
      contentEntity.addMedia(
        MovieEntity.createFrom({
          id: content.Movie.id,
          createdAt: new Date(content.Movie.createdAt),
          updatedAt: new Date(content.Movie.createdAt),
          video: VideoEntity.createFrom({
            id: content.Movie.Video.id,
            url: content.Movie.Video.url,
            duration: content.Movie.Video.duration,
            sizeInKb: content.Movie.Video.sizeInKb,
            createdAt: new Date(content.Movie.Video.createdAt),
            updatedAt: new Date(content.Movie.Video.updatedAt),
          }),
        }),
      );
      if (content.Movie.Thumbnail) {
        contentEntity.getMedia()?.addThumbnail(
          ThumbnailEntity.createFrom({
            id: content.Movie.Thumbnail.id,
            url: content.Movie.Thumbnail.url,
            createdAt: new Date(content.Movie.Thumbnail.createdAt),
            updatedAt: new Date(content.Movie.Thumbnail.updatedAt),
          }),
        );
      }
    }
    return contentEntity;
  }

  private isMovie(content: unknown): content is Prisma.ContentGetPayload<{
    include: {
      Movie: {
        include: { Video: true };
      };
    };
  }> {
    if (typeof content === 'object' && content !== null && 'Movie' in content) {
      return true;
    }
    return false;
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return `An unexpected error occurred.`;
  }

  protected handleAndThrowError(error: unknown): never {
    const errorMessage = this.extractErrorMessage(error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error(error.message);
    }
    throw new Error(errorMessage);
  }
}
