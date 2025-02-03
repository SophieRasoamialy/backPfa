const { Sequelize } = require('sequelize');
const config = require('./config');
require('dotenv').config();


const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    },
    port: process.env.DB_PORT,
  }
);

module.exports = sequelize;
