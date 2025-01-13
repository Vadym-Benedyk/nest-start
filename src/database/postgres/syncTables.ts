import { Sequelize } from 'sequelize-typescript';
import databaseConfig from './dbConfig.general';

const sequelize = new Sequelize({
  ...databaseConfig,
  models: [__dirname + '/models/*.model.js'],
});

async function syncTables() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database established successfully.');

    await sequelize.sync({ alter: true });
    console.log('All tables were synchronized successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    await sequelize.close();
  }
}

export default syncTables
