// require('dotenv').config();
// const process = require('node:process');
import 'dotenv/config';

export default {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
  },
};
