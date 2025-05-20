import { Inject, Injectable } from '@nestjs/common';
import { DefaultTypeOrmRepository } from '@src/infra/module/typeorm/repository/default-typeorm.repository';
import { Content } from '../entities/content.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ContentRepository extends DefaultTypeOrmRepository<Content> {
  constructor(@Inject(DataSource) readonly datasource: DataSource) {
    super(Content, datasource);
  }
}
