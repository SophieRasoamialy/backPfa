'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Récupérer les vrais IDs des tables parentes
    const [etudiants] = await queryInterface.sequelize.query('SELECT id_etudiant FROM Etudiants;');
    const [edts] = await queryInterface.sequelize.query('SELECT id_edt FROM EmploiDuTemps;');

    const hours = ['7:30', '09:00', '10:30', '12:00', '13:00', '14:30', '16:00'];
    
    const fakePointages = Array.from({ length: 50 }, () => {
      const randomDate = faker.date.recent();
      const randomIndex = faker.number.int({ min: 0, max: hours.length - 2 });
      const randomHour = hours[randomIndex];
      const randomHourFin = hours[randomIndex + 1];

      return {
        id_etudiant: faker.helpers.arrayElement(etudiants).id_etudiant,
        id_edt: faker.helpers.arrayElement(edts).id_edt,
        pointage_entre: new Date(`${randomDate.toISOString().split('T')[0]} ${randomHour}`),
        pointage_sortie: new Date(`${randomDate.toISOString().split('T')[0]} ${randomHourFin}`),
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert('Pointages', fakePointages, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Pointages', null, {});
  }
};