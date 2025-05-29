import { DefaultEntity } from '@contentModule/infra/module/typeorm/entity/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'thumbnail' })
export class Thumbnail extends DefaultEntity<Thumbnail> {
  @Column()
  url: string;
}
