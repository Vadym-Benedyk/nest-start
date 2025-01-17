// import { Dialect } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();
// import 'dotenv/config';

// module.exports = {
//   development: {
//     username: process.env.DATABASE_USERNAME,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
//     host: process.env.DATABASE_HOST,
//     dialect: 'postgres',
//     port: parseInt(process.env.DATABASE_PORT || '5432', 10),
//   },
//   test: {
//     username: process.env.DATABASE_USERNAME,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
//     host: process.env.DATABASE_HOST,
//     dialect: 'postgres',
//     port: parseInt(process.env.DATABASE_PORT || '5432', 10),
//   },
//   production: {
//     username: process.env.DATABASE_USERNAME,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
//     host: process.env.DATABASE_HOST,
//     dialect: 'postgres',
//     port: parseInt(process.env.DATABASE_PORT || '5432', 10),
//   },
// }

import {
  baseConfigInterface,
  DbConfigInterface,
} from './interfaces/dbConfig.interface';
import { Dialect } from 'sequelize';

const baseConfig: baseConfigInterface = {
  dialect: (process.env.DATABASE_DIALECT as Dialect) || 'postgres',
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'usersdb',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
};

export const databaseConfig: DbConfigInterface = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};

// export default databaseConfig;
