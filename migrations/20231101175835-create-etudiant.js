'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Etudiants', {
      id_etudiant: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom_etudiant: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prenom_etudiant: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Etudiants');
  }
};