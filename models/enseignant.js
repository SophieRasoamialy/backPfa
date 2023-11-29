const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Enseignant extends Model {
  static associate(models) {
    // Définissez les éventuelles associations ici
    Enseignant.hasMany(models.Matiere, { foreignKey: 'id_enseignant' });
  }
}

Enseignant.init(
  {
    id_enseignant: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom_enseignant: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prenom_enseignant: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Enseignant',
    tableName: 'enseignants',
  }
);

module.exports = Enseignant;
