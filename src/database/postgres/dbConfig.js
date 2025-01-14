import 'dotenv/config';

const baseConfig = {
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'usersdb',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  dialect: process.env.DATABASE_DIALECT || 'postgres',
};

const databaseConfig = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};

export default databaseConfig;
