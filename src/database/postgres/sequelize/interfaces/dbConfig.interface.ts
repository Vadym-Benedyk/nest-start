import 'dotenv/config';

export interface baseConfigInterface {
  models: string[];
  url: string;
  synchronize: boolean;
  autoLoadModels: boolean;
}