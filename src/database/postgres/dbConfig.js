require('dotenv').config();
const process = require('node:process');
const databaseConfig = require('./dbConfig.general');


module.exports = {
  development: {
    ...databaseConfig,
  },
};
