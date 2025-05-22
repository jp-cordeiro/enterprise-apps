import { Inject, Injectable } from '@nestjs/common';
import { DefaultTypeOrmRepository } from '@src/infra/module/typeorm/repository/default-typeorm.repository';
import { Episode } from '../entities/episode.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class EpisodeRepository extends DefaultTypeOrmRepository<Episode> {
  constructor(@Inject(DataSource) readonly datasource: DataSource) {
    super(Episode, datasource);
  }
}
