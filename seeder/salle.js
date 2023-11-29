const faker = require('faker');
const sequelize = require('../config/sequelize');
const Salle = require('../models/salle');

const generateFakeRooms = async (count) => {
  const fakeRooms = [];
  for (let i = 0; i < count; i++) {
    let numSalle;
    let salleExists = true;

    // Générer un numéro de salle unique
    while (salleExists) {
      numSalle = faker.random.number({ min: 100, max: 500 });
      const existingSalle = await Salle.findOne({ where: { num_salle: numSalle } });
      salleExists = !!existingSalle;
    }

    fakeRooms.push({
      num_salle: numSalle,
    });
  }
  return fakeRooms;
};

(async () => {
  try {
    await sequelize.sync(); // Synchronise le modèle avec la base de données

    const fakeData = await generateFakeRooms(15); // Génère 15 enregistrements de salles
    await Salle.bulkCreate(fakeData);

    console.log('Salles fictives insérées avec succès dans la table Salle.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await sequelize.close(); // Ferme la connexion à la base de données
  }
})();
