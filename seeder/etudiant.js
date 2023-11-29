const faker = require('faker');
const sequelize = require('../config/sequelize');
const Etudiant = require('../models/etudiant');

// Récupérer les valeurs existantes d'id_niveau depuis la base de données
// C'est un exemple simple, veuillez remplacer cette partie avec une vraie méthode pour obtenir les valeurs d'id_niveau depuis la base de données
const existingNiveauIds = [1, 2, 3,4,5,6,7,8,9,10,11,12,13,14]; // Remplacez ceci par les vraies valeurs existantes d'id_niveau

// Générer des noms d'étudiants fictifs en utilisant des valeurs d'id_niveau existantes
const generateFakeStudents = (count, existingIds) => {
  const fakeStudents = [];
  for (let i = 0; i < count; i++) {
    fakeStudents.push({
      nom_etudiant: faker.name.lastName(),
      prenom_etudiant: faker.name.firstName(),
      id_niveau: faker.random.arrayElement(existingIds)
    });
  }
  return fakeStudents;
};

(async () => {
  try {
    await sequelize.sync(); // Synchronise le modèle avec la base de données

    // Génère 10 enregistrements d'étudiants
    const fakeData = generateFakeStudents(100, existingNiveauIds);
    await Etudiant.bulkCreate(fakeData);

    console.log('Étudiants fictifs insérés avec succès dans la table Etudiant.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await sequelize.close(); // Ferme la connexion à la base de données
  }
})();
