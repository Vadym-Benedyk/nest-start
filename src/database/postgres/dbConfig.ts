import { Dialect } from 'sequelize';
import 'dotenv/config';
import {
  baseConfigInterface,
  DbConfigInterface,
} from './interfaces/dbConfig.interface';

const baseConfig: baseConfigInterface = {
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'usersdb',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  dialect: (process.env.DATABASE_DIALECT as Dialect) || 'postgres',
};

const databaseConfig: DbConfigInterface = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};

export default databaseConfig;
