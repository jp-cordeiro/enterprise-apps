import { Inject, Injectable } from '@nestjs/common';
import { DefaultTypeOrmRepository } from '@contentModule/infra/module/typeorm/repository/default-typeorm.repository';
import { TvShow } from '../entities/tv-show.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class TvShowRepository extends DefaultTypeOrmRepository<TvShow> {
  constructor(@Inject(DataSource) readonly datasource: DataSource) {
    super(TvShow, datasource);
  }
}
