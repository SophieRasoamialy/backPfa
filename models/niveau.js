const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Niveau extends Model {
  static associate(models) {
    // Associations éventuelles
  }
}

Niveau.init(
  {
    id_niveau: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    niveau: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Niveau',
    tableName: 'Niveaux',
    timestamps: false // Si vous ne voulez pas de timestamps
  }
);

module.exports = Niveau;
