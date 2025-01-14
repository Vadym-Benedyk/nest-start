import { Dialect } from 'sequelize';
import 'dotenv/config';

// Інтерфейс для однієї конфігурації
interface baseConfigInterface {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
}

// Інтерфейс для повної конфігурації середовищ
interface DbConfigInterface {
  development: baseConfigInterface;
  production: baseConfigInterface;
  test: baseConfigInterface;
}
export { baseConfigInterface, DbConfigInterface };
