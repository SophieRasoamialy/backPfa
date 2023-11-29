'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('emploidutemps', 'heure_fin', {
      type: Sequelize.TIME,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('emploiedutemps', 'heure_fin');
  }
};
