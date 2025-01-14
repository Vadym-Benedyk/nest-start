import { Dialect } from 'sequelize';
import 'dotenv/config';

interface baseConfigInterface {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
}

interface DbConfigInterface {
  development: baseConfigInterface;
  production: baseConfigInterface;
  test: baseConfigInterface;
}
export { baseConfigInterface, DbConfigInterface };
