'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pointages', {
      id_pointage: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_etudiant: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Etudiants',
          key: 'id_etudiant'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_edt: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'EmploiDuTemps',
          key: 'id_edt'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pointage_entre: {
        type: Sequelize.DATE,
        allowNull: false
      },
      pointage_sortie: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Pointages');
  }
};
