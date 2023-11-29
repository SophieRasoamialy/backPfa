const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Etudiant extends Model {
  static associate(models) {
    // Définir les éventuelles associations
    Etudiant.belongsTo(models.Niveau, { foreignKey: 'id_niveau' });
  }
}

Etudiant.init(
  {
    id_etudiant: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom_etudiant: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prenom_etudiant: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_niveau: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Etudiant',
    tableName: 'etudiants'
  }
);

module.exports = Etudiant;
