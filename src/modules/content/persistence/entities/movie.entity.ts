import { DefaultEntity } from '@sharedModules/typeorm/entity/default.entity';
import { Content } from './content.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Thumbnail } from './thumbnail.entity';
import { Video } from './video.entity';

@Entity({ name: 'movie' })
export class Movie extends DefaultEntity<Movie> {
  @OneToOne(() => Video, (video) => video.movie, {
    cascade: true,
  })
  video: Video;

  @Column({ type: 'float', nullable: true })
  externalRating: number | null;

  @OneToOne(() => Content, (content) => content.movie)
  @JoinColumn()
  content: Content;

  @OneToOne(() => Thumbnail, { cascade: true })
  @JoinColumn()
  thumbnail: Thumbnail | null;
}
