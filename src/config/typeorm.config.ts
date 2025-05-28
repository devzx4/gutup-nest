// INFO: This is used by the application to connect to DB

import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { UserSubscriber } from '@modules/auth/subscribers/user.subscriber';

// INFO: make sure to change datasource config as well if any relevant changes are made here
export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get<string>('PG_HOST'),
    port: parseInt(configService.get<string>('PG_PORT'), 10),
    username: configService.get<string>('PG_USERNAME'),
    database: configService.get<string>('PG_NAME'),
    password: configService.get<string>('PG_PASSWORD'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    ssl: {
      rejectUnauthorized: false,
    },
    subscribers: [UserSubscriber],
    // INFO: make sure to set synchronize to false and use migration for data change
    // synchronize: true,
    // INFO: uncomment when in debug mode to see all query related logs
    // logging: true,
    // INFO: uncomment when after mode to see all query related logs
    logging: configService.get<string>('ENVIRONMENT') === 'local' ? true : ['error', 'schema', 'warn', 'info', 'log'],
  }),
  dataSourceFactory: async (options) => {
    return new DataSource(options).initialize();
  },
};
