const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Pointage extends Model {
  static associate(models) {
    // Définir les éventuelles associations ici
    Pointage.belongsTo(models.Etudiant, { foreignKey: 'id_etudiant' });
    Pointage.belongsTo(models.EmploiDuTemps, { foreignKey: 'id_edt' });
  }
}

Pointage.init(
  {
    id_pointage: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_etudiant: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_edt: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pointage_entre: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pointage_sortie: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Pointage',
    tableName: 'pointages'
  }
);

module.exports = Pointage;
