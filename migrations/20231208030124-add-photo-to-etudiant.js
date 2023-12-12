'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('etudiants', 'photo_etudiant', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'images/visaaa.jpg'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('etudiants', 'photo_etudiant');
  }
};