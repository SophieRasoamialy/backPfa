'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Matieres', {
      id_matiere: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      matiere: {
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
      id_enseignant: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Enseignants', // Nom de la table de référence (assurez-vous que c'est correct)
          key: 'id_enseignant' // Colonne à laquelle cette clé étrangère fait référence dans la table Enseignants
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
    await queryInterface.dropTable('Matieres');
  }
};
