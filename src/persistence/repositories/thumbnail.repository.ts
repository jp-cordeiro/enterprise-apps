import { Inject, Injectable } from '@nestjs/common';
import { DefaultTypeOrmRepository } from '@src/infra/module/typeorm/repository/default-typeorm.repository';
import { Thumbnail } from '../entities/thumbnail.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ThumbnailRepository extends DefaultTypeOrmRepository<Thumbnail> {
  constructor(@Inject(DataSource) readonly datasource: DataSource) {
    super(Thumbnail, datasource);
  }
}
