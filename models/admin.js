'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Admin extends Model {}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admins',
  }
);

module.exports = Admin;
