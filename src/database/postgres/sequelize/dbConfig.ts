import {
  baseConfigInterface
} from '@/src/database/postgres/sequelize/interfaces/dbConfig.interface';
import * as process from 'node:process';
import { Dialect } from 'sequelize';


export const baseConfig: baseConfigInterface = {
  models: [__dirname + '/entities/*.models.js'],
  url: process.env.DATABASE_URL,
  // dialect: process.env.DATABASE_DIALECT as Dialect,
  dialect: 'postgres' as Dialect,
  synchronize: false,
  autoLoadModels: true,
};
