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
          model: 'Niveaux', // Nom de la table de référence (assurez-vous que c'est correct)
          key: 'id_niveau' // Colonne à laquelle cette clé étrangère fait référence dans la table Niveaux
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_matiere: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Matieres', // Nom de la table de référence (assurez-vous que c'est correct)
          key: 'id_matiere' // Colonne à laquelle cette clé étrangère fait référence dans la table Matieres
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_salle: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Salles', // Nom de la table de référence (assurez-vous que c'est correct)
          key: 'num_salle' // Colonne à laquelle cette clé étrangère fait référence dans la table Salles
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
