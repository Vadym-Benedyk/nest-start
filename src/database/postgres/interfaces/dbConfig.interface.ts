import { Dialect } from 'sequelize';
import 'dotenv/config';

interface baseConfigInterface {
  dialect: Dialect;
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
}

interface DbConfigInterface {
  development: baseConfigInterface;
  production: baseConfigInterface;
  test: baseConfigInterface;
}
export { baseConfigInterface, DbConfigInterface };
