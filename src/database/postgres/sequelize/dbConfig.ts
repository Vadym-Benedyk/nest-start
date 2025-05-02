import {
  baseConfigInterface
} from '@/src/database/postgres/sequelize/interfaces/dbConfig.interface';
import { Dialect } from 'sequelize';

export const baseConfig: baseConfigInterface = {
  models: [__dirname + '/entities/*.models.js'],
  url: process.env.DATABASE_URL,
  dialect: process.env.DATABASE_DIALECT as Dialect,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  synchronize: false,
  autoLoadModels: true
};
