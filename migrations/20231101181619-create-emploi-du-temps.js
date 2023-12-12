'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmploiDuTemps', {
      id_edt: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      heure: {
        type: Sequelize.TIME,
        allowNull: false
      },
      id_niveau: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Niveaux',
          key: 'id_niveau'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_matiere: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Matieres', 
          key: 'id_matiere' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_salle: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Salles', 
          key: 'num_salle' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('EmploiDuTemps');
  }
};
