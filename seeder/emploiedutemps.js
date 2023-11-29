const faker = require('faker');
const sequelize = require('../config/sequelize');
const EmploiDuTemps = require('../models/emploidutemps');

const generateFakeEmploiDuTemps = (count, niveauIds, salleIds, matiereIds) => {
  const fakeEmplois = [];
  for (let i = 0; i < count; i++) {
    const randomDate = faker.date.future();

    const randomHourFin = faker.random.arrayElement(['09:00', '10:30', '12:00', '13:00', '14:30', '16:00', '17:30']);

    const hours = ['7:30', '09:00', '10:30', '12:00', '13:00', '14:30', '16:00'];
    const randomIndex = faker.random.number({ min: 0, max: hours.length - 2 });
    const randomHour = faker.random.arrayElement(hours.slice(randomIndex + 1));

    const randomNiveauId = faker.random.arrayElement(niveauIds);
    const randomSalleId = faker.random.arrayElement(salleIds);
    const randomMatiereId = faker.random.arrayElement(matiereIds);

    fakeEmplois.push({
      date: randomDate,
      heure: randomHour,
      heure_fin: randomHourFin,
      id_niveau: randomNiveauId,
      id_salle: randomSalleId,
      id_matiere: randomMatiereId,
    });
  }
  return fakeEmplois;
};

(async () => {
  try {
    await sequelize.sync(); // Synchronise le modèle avec la base de données

    const niveauIds = [1, 2, 3,4,5,6,7,8,9,10,11,12,13,14]; // Exemple d'IDs existants de niveaux
    const salleIds = [389, 437, 486, 168, 237, 373, 328, 307, 433, 289, 453, 304, 182, 142, 479];
    // Exemple d'IDs existants de salles
    const matiereIds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
    ; // Exemple d'IDs existants de matières

    const fakeData = generateFakeEmploiDuTemps(50, niveauIds, salleIds, matiereIds);
    await EmploiDuTemps.bulkCreate(fakeData);

    console.log('Emplois du temps fictifs insérés avec succès dans la table EmploiDuTemps.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await sequelize.close(); // Ferme la connexion à la base de données
  }
})();
