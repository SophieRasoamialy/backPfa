const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class EmploiDuTemps extends Model {
  static associate(models) {
    // Définir les éventuelles associations ici
    EmploiDuTemps.belongsTo(models.Niveau, { foreignKey: 'id_niveau' });
    EmploiDuTemps.belongsTo(models.Matiere, { foreignKey: 'id_matiere' });
    EmploiDuTemps.belongsTo(models.Salle, { foreignKey: 'id_salle' });
    EmploiDuTemps.hasMany(models.Pointage, { foreignKey: 'id_edt' });
  }
}

EmploiDuTemps.init(
  {
    id_edt: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    heure: {
      type: DataTypes.TIME,
      allowNull: false
    },
    heure_fin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    id_niveau: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_matiere: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_salle: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'EmploiDuTemps',
    tableName: 'emploidutemps'
  }
);

module.exports = EmploiDuTemps;
