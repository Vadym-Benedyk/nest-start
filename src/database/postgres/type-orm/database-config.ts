import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'node:process';

export const ormDbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // У продакшені: false!
  autoLoadEntities: true,
};