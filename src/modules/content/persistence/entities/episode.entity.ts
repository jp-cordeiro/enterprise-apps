import { DefaultEntity } from '@sharedModules/typeorm/entity/default.entity';
import { TvShow } from './tv-show.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Thumbnail } from './thumbnail.entity';
import { Video } from './video.entity';

@Entity({ name: 'episode' })
export class Episode extends DefaultEntity<Episode> {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'int', nullable: false })
  season: number;

  @Column({ type: 'int', nullable: false })
  number: number;

  @Column({ type: 'uuid', nullable: false })
  tvShowId: string;

  @ManyToOne(() => TvShow, (tvShow) => tvShow.episodes)
  tvShow: TvShow;

  @OneToOne(() => Thumbnail)
  @JoinColumn()
  thumbnail: Thumbnail | null;

  @OneToOne(() => Video, (video) => video.episode, {
    cascade: true,
  })
  video: Video | null;
}
