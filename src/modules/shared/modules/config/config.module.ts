import { DynamicModule } from '@nestjs/common';
import {
  ConfigModuleOptions as NestConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { factory } from './util/config.factory';
import { ConfigServiceApp } from './services/config.service';

export class ConfigModule {
  static forRoot(options?: NestConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          ...options,
          expandVariables: true,
          load: options?.load ? [factory, ...options.load] : [factory],
        }),
      ],
      providers: [ConfigServiceApp],
      exports: [ConfigServiceApp],
    };
  }
}
