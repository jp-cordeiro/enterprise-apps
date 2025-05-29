import { DefaultEntity } from '@contentModule/infra/module/typeorm/entity/default.entity';
import { Movie } from './movie.entity';
import { Episode } from './episode.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'video' })
export class Video extends DefaultEntity<Video> {
  @Column()
  url: string;

  @Column()
  sizeInKb: number;

  @Column()
  duration: number;

  @OneToOne(() => Movie, (movie) => movie.video)
  @JoinColumn()
  movie: Movie;

  @OneToOne(() => Episode, (episode) => episode.video)
  @JoinColumn()
  episode: Episode;
}
