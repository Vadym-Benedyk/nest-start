import "reflect-metadata";
import { DataSourceOptions } from 'typeorm';


export const typeOrmConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "poster",
  synchronize: false,
  entities: ["dist/database/postgres/type-orm/entities/*.entity.js"],
  migrations: ["dist/database/postgres/type-orm/migrations/*.js"],
};