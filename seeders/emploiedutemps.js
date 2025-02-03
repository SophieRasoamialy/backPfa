'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Récupérer les vrais IDs
    const [niveaux] = await queryInterface.sequelize.query('SELECT id_niveau FROM Niveaux;');
    const [salles] = await queryInterface.sequelize.query('SELECT num_salle FROM Salles;');
    const [matieres] = await queryInterface.sequelize.query('SELECT id_matiere FROM Matieres;');

    const hours = ['7:30', '09:00', '10:30', '12:00', '13:00', '14:30', '16:00'];
    
    const fakeEmplois = Array.from({ length: 50 }, () => {
      const randomDate = faker.date.recent();
      const randomIndex = faker.number.int({ min: 0, max: hours.length - 2 });
      const randomHour = hours[randomIndex];
      const randomHourFin = hours[randomIndex + 1];

      return {
        date: randomDate,
        heure: randomHour,
        heure_fin: randomHourFin,
        id_niveau: niveaux[Math.floor(Math.random() * niveaux.length)].id_niveau,
        id_salle: salles[Math.floor(Math.random() * salles.length)].num_salle,
        id_matiere: matieres[Math.floor(Math.random() * matieres.length)].id_matiere,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert('EmploiDuTemps', fakeEmplois, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('EmploiDuTemps', null, {});
  }
};
