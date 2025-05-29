import { DefaultEntity } from '@shared/typeorm/entity/default.entity';
import { Content } from './content.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Thumbnail } from './thumbnail.entity';
import { Episode } from './episode.entity';

@Entity({ name: 'tv_show' })
export class TvShow extends DefaultEntity<TvShow> {
  @OneToMany(() => Episode, (episode) => episode.tvShow)
  episodes: Episode[];

  @OneToOne(() => Content)
  @JoinColumn()
  content: Content;

  @OneToOne(() => Thumbnail)
  @JoinColumn()
  thumbnail: Thumbnail;
}
