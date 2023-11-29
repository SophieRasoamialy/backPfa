const faker = require('faker');
const sequelize = require('../config/sequelize');
const Matiere = require('../models/matiere');

// Récupérer les valeurs existantes d'id_niveau depuis la base de données
// C'est un exemple simple, veuillez remplacer cette partie avec une vraie méthode pour obtenir les valeurs d'id_niveau depuis la base de données
const existingNiveauIds = [1, 2, 3,4,5,6,7,8,9,10,11,12,13,14]; // Remplacez ceci par les vraies valeurs existantes d'id_niveau
const existingPofIds = [1, 2, 3,4,5,6,7,8,9,10,11,12,13,14,15];
// Générer des noms de matières fictifs en utilisant des valeurs d'id_niveau existantes
const generateFakeSubjects = (count, existingNiveauIds, existingProfIds) => {
  const fakeSubjects = [];
  for (let i = 0; i < count; i++) {
    fakeSubjects.push({
      matiere: faker.random.words(2),
      id_niveau: faker.random.arrayElement(existingNiveauIds),
      id_enseignant: faker.random.arrayElement(existingProfIds)
    });
  }
  return fakeSubjects;
};

(async () => {
  try {
    await sequelize.sync(); // Synchronise le modèle avec la base de données

    // Génère 10 enregistrements de matières
    const fakeData = generateFakeSubjects(50, existingNiveauIds, existingPofIds);
    await Matiere.bulkCreate(fakeData);

    console.log('Noms de matières fictifs insérés avec succès dans la table Matiere.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await sequelize.close(); // Ferme la connexion à la base de données
  }
})();
