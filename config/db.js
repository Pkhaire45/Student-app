const { Sequelize } = require('sequelize');
require('dotenv').config(); // load env vars

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false, // disable SQL logs on console
  }
);

module.exports = sequelize;
