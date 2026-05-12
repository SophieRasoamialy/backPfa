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
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo_etudiant: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'images/visaaa.jpg'
    },
    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_password_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    id_niveau: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Etudiant',
    tableName: 'Etudiants'
  }
);

module.exports = Etudiant;
