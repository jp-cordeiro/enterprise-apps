import { randomUUID } from 'crypto';
import { BaseEntity, BaseEntityProps } from './base.entity';

export type NewVideoEntity = Omit<
  VideoEntityProps,
  'id' | 'createdAt' | 'updatedAt'
>;

export interface VideoEntityProps extends BaseEntityProps {
  url: string;
  sizenInKb: number;
  duration: number;
}

export class VideoEntity extends BaseEntity {
  private url: VideoEntityProps['url'];
  private sizenInKb: VideoEntityProps['sizenInKb'];
  private duration: VideoEntityProps['duration'];

  private constructor(private readonly data: VideoEntityProps) {
    super(data);
  }

  static createNew(data: NewVideoEntity, id = randomUUID()): VideoEntity {
    return new VideoEntity({
      id,
      url: data.url,
      sizenInKb: data.sizenInKb,
      duration: data.duration,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createFrom(data: VideoEntityProps): VideoEntity {
    return new VideoEntity({
      id: data.id,
      url: data.url,
      sizenInKb: data.sizenInKb,
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
    return this.sizenInKb;
  }
  getDuration(): number {
    return this.duration;
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      url: this.url,
      sizenInKb: this.sizenInKb,
      duration: this.duration,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
