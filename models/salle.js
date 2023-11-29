// models/salle.js
'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Salle extends Model {
  static associate(models) {
    // Éventuelles associations à définir ici
  }
}

Salle.init(
  {
    num_salle: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Utilisation de num_salle comme clé primaire
      autoIncrement: false, // Désactiver l'auto-incrémentation
    },
  },
  {
    sequelize,
    modelName: 'Salle',
    tableName: 'salles', 
  }
);

module.exports = Salle;
