'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Récupérer les vrais IDs des niveaux et enseignants
    const [niveaux] = await queryInterface.sequelize.query('SELECT id_niveau FROM Niveaux;');
    const [enseignants] = await queryInterface.sequelize.query('SELECT id_enseignant FROM Enseignants;');

    const matieres = [
      'Mathématiques', 'Physique', 'Chimie', 'Informatique', 'Anglais',
      'Français', 'Histoire', 'Géographie', 'Biologie', 'Sport'
    ];

    const fakeMatieres = matieres.map(matiere => ({
      matiere,
      id_niveau: niveaux[Math.floor(Math.random() * niveaux.length)].id_niveau,
      id_enseignant: enseignants[Math.floor(Math.random() * enseignants.length)].id_enseignant,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('Matieres', fakeMatieres, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Matieres', null, {});
  }
};
  
