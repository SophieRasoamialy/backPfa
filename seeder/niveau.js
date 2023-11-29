const sequelize = require('../config/sequelize');
const Niveau = require('../models/niveau'); 


// Données à insérer dans la table "Niveaux"
const data = [
    { niveau: 'L1 PRO' },
    { niveau: 'L1 IG' },
    { niveau: 'L2 GB' },
    { niveau: 'L2 SR' },
    { niveau: 'L2 IG' },
    { niveau: 'L3 GB' },
    { niveau: 'L3 SR' },
    { niveau: 'L3 IG' },
    { niveau: 'M1 GB' },
    { niveau: 'M1 SR' },
    { niveau: 'M1 IG' },
    { niveau: 'M2 GB' },
    { niveau: 'M2 SR' },
    { niveau: 'M2 IG' }
];

(async () => {
  try {
    await sequelize.sync(); // Synchronise le modèle avec la base de données
    await Niveau.bulkCreate(data); // Insère les données dans la table Niveaux
    console.log('Données insérées avec succès dans la table Niveaux.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await sequelize.close(); // Ferme la connexion à la base de données
  }
})();
