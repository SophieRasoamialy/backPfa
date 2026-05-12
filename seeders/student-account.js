'use strict';

const { hashPassword } = require('../utils/password');

const STUDENT_EMAIL = 'etudiant@facecheck.local';
const STUDENT_PASSWORD = 'Etudiant1234!';

module.exports = {
  up: async (queryInterface) => {
    const [niveaux] = await queryInterface.sequelize.query(
      'SELECT id_niveau FROM Niveaux ORDER BY id_niveau ASC LIMIT 1;'
    );

    if (!niveaux || niveaux.length === 0) {
      throw new Error('Aucun niveau trouve. Executez d abord le seeder de niveaux.');
    }

    const password = await hashPassword(STUDENT_PASSWORD);

    return queryInterface.bulkInsert('Etudiants', [
      {
        nom_etudiant: 'Rakoto',
        prenom_etudiant: 'Jean',
        email: STUDENT_EMAIL,
        password,
        photo_etudiant: 'https://avatars.githubusercontent.com/u/1?v=4',
        id_niveau: niveaux[0].id_niveau,
        reset_password_token: null,
        reset_password_expires_at: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Etudiants', {
      email: STUDENT_EMAIL,
    });
  },
};
