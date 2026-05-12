'use strict';

const { hashPassword } = require('../utils/password');

const ADMIN_EMAIL = 'admin@facecheck.local';
const ADMIN_PASSWORD = 'Admin1234!';

module.exports = {
  up: async (queryInterface) => {
    const password = await hashPassword(ADMIN_PASSWORD);

    return queryInterface.bulkInsert('Admins', [
      {
        email: ADMIN_EMAIL,
        password,
        reset_password_token: null,
        reset_password_expires_at: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Admins', {
      email: ADMIN_EMAIL,
    });
  },
};
