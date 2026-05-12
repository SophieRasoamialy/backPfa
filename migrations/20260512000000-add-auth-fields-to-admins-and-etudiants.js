'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Admins', 'reset_password_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Admins', 'reset_password_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Etudiants', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.addColumn('Etudiants', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Etudiants', 'reset_password_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Etudiants', 'reset_password_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Etudiants', 'reset_password_expires_at');
    await queryInterface.removeColumn('Etudiants', 'reset_password_token');
    await queryInterface.removeColumn('Etudiants', 'password');
    await queryInterface.removeColumn('Etudiants', 'email');
    await queryInterface.removeColumn('Admins', 'reset_password_expires_at');
    await queryInterface.removeColumn('Admins', 'reset_password_token');
  },
};
