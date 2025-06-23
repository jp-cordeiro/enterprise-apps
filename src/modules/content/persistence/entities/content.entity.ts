import { DefaultEntity } from '@sharedModules/typeorm/entity/default.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Movie } from './movie.entity';
import { TvShow } from './tv-show.entity';
import { CONTENT_TYPE } from '@contentModule/core/enums/content-type.enum';

@Entity({ name: 'content' })
export class Content extends DefaultEntity<Content> {
  @Column({ nullable: false, type: 'enum', enum: CONTENT_TYPE })
  type: CONTENT_TYPE;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @OneToOne(() => Movie, (movie) => movie.content, { cascade: true })
  movie: Movie;

  @OneToOne(() => TvShow, (tvShow) => tvShow.content, { cascade: true })
  tvShow: TvShow | null;
}
