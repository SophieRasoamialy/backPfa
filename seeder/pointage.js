
const faker = require('faker');
const sequelize = require('../config/sequelize');
const Pointage = require('../models/pointage');
const EmploiDuTemps = require('../models/emploidutemps');

const generateFakePointages = async (count, edtIds, etudiantIds) => {
  try {
    const fakePointages = [];
    await sequelize.authenticate(); // Vérifier la connexion à la base de données

    for (let i = 0; i < count; i++) {
      const randomIdEdt = faker.random.arrayElement(edtIds);
      const randomIdEtudiant = faker.random.arrayElement(etudiantIds);

      const emploiDuTemps = await EmploiDuTemps.findOne({ where: { id_edt: randomIdEdt } });

      const randomDate = emploiDuTemps.date;
      const randomHourFin = emploiDuTemps.heure_fin;
      const hours = ['7:30', '09:00', '10:30', '12:00', '13:00', '14:30', '16:00'];
      const randomIndex = hours.indexOf(emploiDuTemps.heure);
      const randomHour = faker.random.arrayElement(hours.slice(randomIndex + 1));

      fakePointages.push({
        id_etudiant: randomIdEtudiant,
        id_edt: randomIdEdt,
        pointage_entre: new Date(`${randomDate} ${randomHour}`),
        pointage_sortie: new Date(`${randomDate} ${randomHourFin}`),
      });
    }

    return fakePointages;
  } catch (error) {
    console.error('Erreur lors de la génération de fausses données de pointages :', error);
    return [];
  }
};

(async () => {
  try {
    await sequelize.sync(); // Synchronisation du modèle avec la base de données

    const edtIds =  [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52, 53, 54, 55, 56, 57, 58, 59, 60]; // Exemple d'IDs existants de EmploiDuTemps
    const etudiantIds =  [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
        71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
        101, 102, 103, 104, 105, 106, 107, 108, 109, 110
      ];

    const fakeData = await generateFakePointages(50, edtIds, etudiantIds);
    await Pointage.bulkCreate(fakeData);

    console.log('Données de pointages fictives insérées avec succès dans la table Pointages.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await sequelize.close(); // Fermeture de la connexion à la base de données
  }
})();