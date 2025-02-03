'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const niveaux = [
      { niveau: 'L1 PRO', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'L1 IG', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'L2 GB', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'L2 SR', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'L2 IG', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'L3 GB', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'L3 SR', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'L3 IG', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'M1 GB', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'M1 SR', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'M1 IG', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'M2 GB', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'M2 SR', createdAt: new Date(), updatedAt: new Date() },
      { niveau: 'M2 IG', createdAt: new Date(), updatedAt: new Date() }
    ];

    return queryInterface.bulkInsert('Niveaux', niveaux, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Niveaux', null, {});
  }
};
