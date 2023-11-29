const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Matiere extends Model {
  static associate(models) {
    // Définissez les éventuelles associations ici
    Matiere.belongsTo(models.Niveau, { foreignKey: 'id_niveau' });
    Matiere.belongsTo(models.Enseignant, { foreignKey: 'id_enseignant' });
  }
}

Matiere.init(
  {
    id_matiere: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    matiere: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_niveau: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_enseignant: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Matiere',
    tableName: 'matieres'
  }
);

module.exports = Matiere;
