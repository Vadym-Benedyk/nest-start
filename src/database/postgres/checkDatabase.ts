import { Client } from 'pg';
import * as process from 'node:process';

async function checkAndCreateDatabase() {
  const dbName = process.env.DATABASE_NAME;
  const adminConfig = {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  };

  const client = new Client(adminConfig);

  try {
    await client.connect();

    const res = await client.query(`SELECT * FROM pg_database WHERE datname = $1`, [dbName]);

    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error('Error checking or creating database:', error);
  } finally {
    await client.end();
  }
}

export default checkAndCreateDatabase;
