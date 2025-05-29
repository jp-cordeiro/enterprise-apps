import { DefaultEntity } from '@shared/typeorm/entity/default.entity';
import { TvShow } from './tv-show.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Thumbnail } from './thumbnail.entity';
import { Video } from './video.entity';

@Entity({ name: 'episode' })
export class Episode extends DefaultEntity<Episode> {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  season: number;

  @ManyToOne(() => TvShow, (tvShow) => tvShow.episodes)
  tvShow: TvShow;

  @OneToOne(() => Thumbnail)
  @JoinColumn()
  thumbnail: Thumbnail;

  @OneToOne(() => Video, (video) => video.episode)
  video: Video;
}
