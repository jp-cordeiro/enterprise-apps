import { Inject, Injectable } from '@nestjs/common';
import { DefaultTypeOrmRepository } from '@sharedModules/typeorm/repository/default-typeorm.repository';
import { Video } from '../entities/video.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class VideoRepository extends DefaultTypeOrmRepository<Video> {
  constructor(@Inject(DataSource) readonly datasource: DataSource) {
    super(Video, datasource);
  }
}
