const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gestion_pointage', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize