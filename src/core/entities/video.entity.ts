import { randomUUID } from 'crypto';
import { BaseEntity, BaseEntityProps } from './base.entity';

export type NewVideoEntity = Omit<
  VideoEntityProps,
  'id' | 'createdAt' | 'updatedAt'
>;

export interface VideoEntityProps extends BaseEntityProps {
  url: string;
  sizeInKb: number;
  duration: number;
}

export class VideoEntity extends BaseEntity {
  private url: VideoEntityProps['url'];
  private sizeInKb: VideoEntityProps['sizeInKb'];
  private duration: VideoEntityProps['duration'];

  private constructor(private readonly data: VideoEntityProps) {
    super(data);
  }

  static createNew(data: NewVideoEntity, id = randomUUID()): VideoEntity {
    return new VideoEntity({
      id,
      url: data.url,
      sizeInKb: data.sizeInKb,
      duration: data.duration,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createFrom(data: VideoEntityProps): VideoEntity {
    return new VideoEntity({
      id: data.id,
      url: data.url,
      sizeInKb: data.sizeInKb,
      duration: data.duration,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static getMaxThumbnailSize(): number {
    const MAX_TUMBNAIL_SIZE = 1024 * 2014 * 10; // 10MB
    return MAX_TUMBNAIL_SIZE;
  }

  static getMaxFileSize(): number {
    const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
    return MAX_FILE_SIZE;
  }

  getUrl(): string {
    return this.url;
  }
  getSizeInKb(): number {
    return this.sizeInKb;
  }
  getDuration(): number {
    return this.duration;
  }

  serialize() {
    return {
      id: this.id,
      url: this.url,
      sizeInKb: this.sizeInKb,
      duration: this.duration,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
