'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Récupérer les IDs des niveaux existants et vérifier qu'ils existent
    const [niveaux] = await queryInterface.sequelize.query('SELECT id_niveau FROM Niveaux;');
    
    if (!niveaux || niveaux.length === 0) {
      throw new Error('La table Niveaux est vide. Exécutez d\'abord le seeder de niveaux.');
    }

    const fakeEtudiants = Array.from({ length: 50 }, () => {
      const niveau = niveaux[Math.floor(Math.random() * niveaux.length)];
      return {
        nom_etudiant: faker.person.lastName(),
        prenom_etudiant: faker.person.firstName(),
        photo_etudiant: faker.image.avatar(),
        id_niveau: niveau.id_niveau, // Utilisation directe d'un ID existant
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert('Etudiants', fakeEtudiants, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Etudiants', null, {});
  }
};
  
