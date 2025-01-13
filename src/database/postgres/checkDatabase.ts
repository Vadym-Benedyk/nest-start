import { Sequelize } from 'sequelize';
import { Client } from 'pg';
import databaseConfig from './dbConfig.general';
import * as process from 'node:process';

async function checkAndCreateDatabase() {
  const dbName = process.env.DATABASE_NAME;
  const adminConfig = databaseConfig;

  const client = new Client(adminConfig);

  try {
    await client.connect();

    // Перевірка наявності бази даних
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

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
