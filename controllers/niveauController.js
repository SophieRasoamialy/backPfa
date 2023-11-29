const Niveau = require('../models/niveau');

// Fonction pour créer un nouveau niveau
async function createNiveau(req, res) {
  try {
    const niveauData = req.body; // Récupérer les données du corps de la requête
    const nouveauNiveau = await Niveau.create(niveauData);
    res.json(nouveauNiveau);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du niveau' });
  }
}

// Fonction pour récupérer tous les niveaux
async function getAllNiveaux(req,res) {
  try {
    const niveaux = await Niveau.findAll();
    res.json(niveaux);
  } catch (error) {
    throw error;
  }
}

// Fonction pour récupérer un niveau par son ID
async function getNiveauById(req, res) {
  try {
    const niveauId = req.params.niveauId; // Récupérer l'ID depuis les paramètres de la requête
    const niveau = await Niveau.findByPk(niveauId);
    if (!niveau) {
      res.status(404).json({ error: 'Niveau non trouvé' });
      return;
    }
    res.json(niveau);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du niveau par ID' });
  }
}

// Fonction pour mettre à jour un niveau par son ID
async function updateNiveau(req, res) {
  try {
    const niveauId = req.params.niveauId;
    const niveauData = req.body;
    const niveau = await Niveau.findByPk(niveauId);
    if (!niveau) {
      res.status(404).json({ error: 'Niveau non trouvé' });
      return;
    }
    await niveau.update(niveauData);
    res.json(niveau);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du niveau' });
  }
}

// Fonction pour supprimer un niveau par son ID
async function deleteNiveau(req, res) {
  try {
    const niveauId = req.params.niveauId;
    const niveau = await Niveau.findByPk(niveauId);
    if (!niveau) {
      res.status(404).json({ error: 'Niveau non trouvé' });
      return;
    }
    await niveau.destroy();
    res.json(niveau);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du niveau' });
  }
}

module.exports = {
  createNiveau,
  getAllNiveaux,
  getNiveauById,
  updateNiveau,
  deleteNiveau,
};
