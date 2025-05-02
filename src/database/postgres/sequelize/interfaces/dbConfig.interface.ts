import { Dialect } from 'sequelize';
import 'dotenv/config';

export interface baseConfigInterface {
  models: string[];
  dialect: Dialect;
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  synchronize: boolean;
  autoLoadModels: boolean;
}