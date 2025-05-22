import { NestFactory } from '@nestjs/core';
import { ConfigServiceApp } from '@src/infra/module/config/services/config.service';
import { TypeOrmMigrationService } from '@src/infra/module/typeorm/service/typeorm-migration-service';
import { PersistenceModule } from '@src/persistence/persistence.module';
import { DataSourceOptions } from 'typeorm';
import { createPostgresDatabase } from 'typeorm-extension';

const createDatabaseModule = async () => {
  return await NestFactory.createApplicationContext(
    PersistenceModule.forRoot({ migrations: [__dirname + '/migrations/*'] }),
  );
};

export const migrate = async () => {
  const migrationModule = await createDatabaseModule();
  migrationModule.init();
  const configService = migrationModule.get<ConfigServiceApp>(ConfigServiceApp);
  const options = {
    ...(configService.get('database') as DataSourceOptions),
  };
  await createPostgresDatabase({
    ifNotExist: true,
    options,
  });
  await migrationModule.get(TypeOrmMigrationService).migrate();
};

export const getDataSource = async () => {
  const migrationModule = await createDatabaseModule();
  return migrationModule.get(TypeOrmMigrationService).getDataSource();
};
