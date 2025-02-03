'use strict';

const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fakeTeachers = Array.from({ length: 15 }, () => ({
      nom_enseignant: faker.name.lastName(),
      prenom_enseignant: faker.name.firstName(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('Enseignants', fakeTeachers, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Enseignants', null, {});
  }
};
