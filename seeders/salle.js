'use strict';

const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fakeRooms = Array.from({ length: 15 }, () => ({
      num_salle: faker.random.number({ min: 100, max: 500 }),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // S'assurer que les numéros de salle sont uniques
    const uniqueRooms = Array.from(new Set(fakeRooms.map(room => room.num_salle))).map(num_salle => ({
      num_salle,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Générer des salles supplémentaires si nécessaire pour atteindre 15 salles
    while (uniqueRooms.length < 15) {
      const newNum = faker.random.number({ min: 100, max: 500 });
      if (!uniqueRooms.find(room => room.num_salle === newNum)) {
        uniqueRooms.push({
          num_salle: newNum,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return queryInterface.bulkInsert('Salles', uniqueRooms, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Salles', null, {});
  }
};
