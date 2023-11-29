import { create } from '../models/Pointage'; // Importez le modèle "Pointage"

// Fonction pour créer un nouveau pointage
async function createPointage(pointageData) {
  try {
    const nouveauPointage = await create(pointageData);
    return nouveauPointage;
  } catch (error) {
    throw error;
  }
}

export default {
  createPointage,
};
