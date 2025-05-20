import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class DefaultTypeOrmRepository<T extends ObjectLiteral> {
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

  async deleteAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('This method can only be used in test environment');
    }
    const entities = await this.repository.find();
    await this.repository.remove(entities);
  }
}
