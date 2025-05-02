import {
  baseConfigInterface
} from '@/src/database/postgres/sequelize/interfaces/dbConfig.interface';


export const baseConfig: baseConfigInterface = {
  models: [__dirname + '/entities/*.models.js'],
  url: process.env.DATABASE_URL,
  synchronize: false,
  autoLoadModels: true,
};
