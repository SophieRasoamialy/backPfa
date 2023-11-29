const Salle = require('../models/salle');

// Fonction pour créer un nouveau salle
async function createSalle(req, res) {
  try {
    const salleData = req.body; // Récupérer les données du corps de la requête
    const nouveausalle = await Salle.create(salleData);
    res.json(nouveausalle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du salle' });
  }
}

// Fonction pour récupérer tous les sallex
async function getAllSalles(req,res) {
  try {
    const salles = await Salle.findAll();
    res.json(salles);
  } catch (error) {
    throw error;
  }
}

// Fonction pour récupérer un salle par son ID
async function getSalleById(req, res) {
  try {
    const salleId = req.params.salleId; // Récupérer l'ID depuis les paramètres de la requête
    const salle = await Salle.findByPk(salleId);
    if (!salle) {
      res.status(404).json({ error: 'salle non trouvé' });
      return;
    }
    res.json(salle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du salle par ID' });
  }
}

// Fonction pour mettre à jour un salle par son ID
async function updateSalle(req, res) {
  try {
    const salleId = req.params.salleId;
    const salleData = req.body;
    const salle = await Salle.findByPk(salleId);
    if (!salle) {
      res.status(404).json({ error: 'salle non trouvé' });
      return;
    }
    await salle.update(salleData);
    res.json(salle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du salle' });
  }
}

// Fonction pour supprimer un salle par son ID
async function deleteSalle(req, res) {
  try {
    const salleId = req.params.salleId;
    const salle = await Salle.findByPk(salleId);
    if (!salle) {
      res.status(404).json({ error: 'salle non trouvé' });
      return;
    }
    await salle.destroy();
    res.json(salle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la salle' });
  }
}

module.exports = {
  createSalle,
  getAllSalles,
  getSalleById,
  updateSalle,
  deleteSalle,
};
