import 'dotenv/config';

export interface baseConfigInterface {
  models: string[];
  url: string;
  dialect: string;
  synchronize: boolean;
  autoLoadModels: boolean;
}