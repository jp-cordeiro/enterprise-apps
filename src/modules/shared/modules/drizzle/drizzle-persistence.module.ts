import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@sharedModules/config/config.module';
import { ConfigServiceApp } from '@sharedModules/config/services/config.service';

@Module({})
export class DrizzlePersistenceModule {
  static forRoot(schema: Record<string, any> = {}): DynamicModule {
    return {
      module: DrizzlePersistenceModule,
      imports: [
        DrizzlePostgresModule.registerAsync({
          tag: 'DB_POSTGRES',
          imports: [ConfigModule.forRoot()],
          inject: [ConfigServiceApp],
          useFactory: (configService: ConfigServiceApp) => ({
            postgres: {
              url: configService.get('database.url'),
            },
            config: { schema: { ...schema }, logger: false },
          }),
        }),
      ],
    };
  }
}
