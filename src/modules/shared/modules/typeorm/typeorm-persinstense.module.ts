import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultEntity } from './entity/default.entity';
import { ConfigModule } from '../config/config.module';
import { ConfigServiceApp } from '../config/services/config.service';
import { TypeOrmMigrationService } from './service/typeorm-migration-service';

@Module({})
export class TypeOrmPersistenceModule {
  static forRoot(options: {
    migrations?: string[];
    entities?: Array<typeof DefaultEntity>;
  }): DynamicModule {
    return {
      module: TypeOrmPersistenceModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
          inject: [ConfigServiceApp],
          useFactory: async (...args: any[]) => {
            const configService = args.find(
              (arg) => arg instanceof ConfigServiceApp,
            ) as ConfigServiceApp | undefined;
            if (!configService) {
              throw new Error('ConfigService not found in arguments');
            }

            return {
              type: 'postgres',
              logging: false,
              autoloadEntities: false,
              synchornize: false,
              migrationsTableName: 'typeorm_migrations',
              ...configService.get('database'),
              ...options,
            };
          },
        }),
      ],
      providers: [TypeOrmMigrationService],
      exports: [TypeOrmMigrationService],
    };
  }
}
