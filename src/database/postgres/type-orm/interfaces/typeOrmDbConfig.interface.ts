import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';

const enum TypeEnum {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  MARIADB = 'mariadb',
  COCKROACHDB = 'cockroachdb',
  SQLITE = 'sqlite',
  CORDOVA = 'cordova',
  NASTY = 'nasty',
  ORACLE = 'oracle',
  MONGODB = 'mongodb',
  SQLJS = 'sqljs',
  SAP = 'sap',
  SQLSERVER = 'mssql',
  OTHER = 'other',
}


interface BaseConfigInterface {
  type: DatabaseType; // Ensure it's a valid TypeORM database type
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  entities: string[];
  migrations: string[];
  subscribers: string[];
  cli: {
    entitiesDir: string;
    migrationsDir: string;
    subscribersDir: string;
  };
}

interface TypeOrmDbConfigInterface {
  development: BaseConfigInterface;
  production: BaseConfigInterface;
}

export { BaseConfigInterface, TypeOrmDbConfigInterface };