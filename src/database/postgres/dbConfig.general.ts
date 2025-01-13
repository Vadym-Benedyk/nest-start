import { Dialect } from 'sequelize';
import 'dotenv/config';
import * as process from 'node:process';

const databaseConfig = {
  dialect: process.env.DATABASE_DIALECT as Dialect || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'usersdb',
  synchronize: false,
  autoLoadModels: true,
};

export default databaseConfig;
