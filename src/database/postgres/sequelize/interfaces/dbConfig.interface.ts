import 'dotenv/config';
import { Dialect } from 'sequelize';


export interface baseConfigInterface {
  models: string[];
  url: string;
  dialect: Dialect;
  synchronize: boolean;
  autoLoadModels: boolean;
}