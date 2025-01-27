import {
  baseConfigInterface,
  DbConfigInterface,
} from './interfaces/dbConfig.interface';
import { Dialect } from 'sequelize';

const baseConfig: baseConfigInterface = {
  dialect: process.env.DATABASE_DIALECT as Dialect,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
};

export const databaseConfig: DbConfigInterface = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};
