// INFO: This file is used by TypeORM CLI to connect to DB

import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT, 10),
  username: process.env.PG_USERNAME,
  database: process.env.PG_NAME,
  password: process.env.PG_PASSWORD,
  entities: ['src/**/*.entity*{.js,.ts}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  ssl: {
    rejectUnauthorized: false,
  },
  // INFO: uncomment when in debug mode to see all query related logs
  logging: true,
  // INFO: make sure to set synchronize to false and use migration for data change
  // synchronize: true,
};

// INFO: this is a workaround for dotenv working for migrations and seeders config
export const dataSource = new DataSource(dataSourceOptions);
