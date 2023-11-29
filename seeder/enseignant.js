const sequelize = require('../config/sequelize');
const Enseignant = require('../models/enseignant');
const faker = require("faker");

// Générer des noms d'enseignants fictifs
const generateFakeTeachers = (count) => {
  const fakeTeachers = [];
  for (let i = 0; i < count; i++) {
    fakeTeachers.push({
      nom_enseignant: faker.name.lastName(),
      prenom_enseignant: faker.name.firstName()
    });
  }
  return fakeTeachers;
};

(async () => {
  try {
    await sequelize.sync(); // Synchronise le modèle avec la base de données
    const fakeData = generateFakeTeachers(15); // Génère 10 noms d'enseignants fictifs
    await Enseignant.bulkCreate(fakeData); // Insère les données dans la table Enseignants
    console.log('Noms d\'enseignants fictifs insérés avec succès dans la table Enseignants.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await sequelize.close(); // Ferme la connexion à la base de données
  }
})();
