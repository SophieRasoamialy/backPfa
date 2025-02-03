'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('EmploiDuTemps', 'heure_fin', {
      type: Sequelize.TIME,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('EmploiDuTemps', 'heure_fin');
  }
};
