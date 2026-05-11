'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Pointages', 'pointage_sortie', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Pointages', 'pointage_sortie', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
