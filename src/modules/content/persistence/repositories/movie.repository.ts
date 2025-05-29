import { Inject, Injectable } from '@nestjs/common';
import { DefaultTypeOrmRepository } from '@shared/typeorm/repository/default-typeorm.repository';
import { Movie } from '../entities/movie.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class MovieRepository extends DefaultTypeOrmRepository<Movie> {
  constructor(@Inject(DataSource) readonly datasource: DataSource) {
    super(Movie, datasource);
  }
}
