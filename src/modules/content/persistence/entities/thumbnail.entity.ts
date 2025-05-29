import { DefaultEntity } from '@sharedModules/typeorm/entity/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'thumbnail' })
export class Thumbnail extends DefaultEntity<Thumbnail> {
  @Column()
  url: string;
}
