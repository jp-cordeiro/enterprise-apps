import {
  DataSource,
  EntityTarget,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { DefaultEntity } from '../entity/default.entity';

export class DefaultTypeOrmRepository<T extends DefaultEntity<T>> {
  private repository: Repository<T>;

  constructor(
    readonly entity: EntityTarget<T>,
    readonly dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(entity);
  }

  async save(enity: T): Promise<T> {
    return await this.repository.save(enity);
  }

  async findOneById(id: string): Promise<T | null> {
    const entity = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<T>);
    return entity || null;
  }

  async deleteAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('This method can only be used in test environment');
    }
    const entities = await this.repository.find();
    await this.repository.remove(entities);
  }
}
