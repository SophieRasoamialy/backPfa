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
          model: 'Niveaux', // Nom de la table de référence (assurez-vous que c'est correct)
          key: 'id_niveau' // Colonne à laquelle cette clé étrangère fait référence dans la table Niveaux
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
