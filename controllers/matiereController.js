const sequelize = require('../config/sequelize');
const Matiere = require('../models/matiere');



// Fonction pour créer une nouvelle matière
async function createMatiere(req, res) {
  try {
    const matiereData = req.body; // Récupérer les données du corps de la requête
    const nouvelleMatiere = await Matiere.create(matiereData);
    res.json(nouvelleMatiere);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la matière' });
  }
}

// Fonction pour récupérer toutes les matières
async function getAllMatieres(req, res) {
  try {
    const matieres = await Matiere.findAll();
    res.json(matieres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de toutes les matières' });
  }
}

// Fonction pour récupérer les matières par niveau avec les informations sur l'enseignant responsable
async function getMatieresByNiveau(req, res) {
  try {
    const niveau = req.params.niveau; // Récupérer le niveau depuis les paramètres de la requête

    const query = `
      SELECT matieres.id_matiere as id_matiere, matieres.matiere as matiere, matieres.id_enseignant as id_enseignant, enseignants.nom_enseignant as nom_enseignant, enseignants.prenom_enseignant as prenom_enseignant
      FROM matieres
      INNER JOIN enseignants ON matieres.id_enseignant = enseignants.id_enseignant
      WHERE matieres.id_niveau = :niveau ORDER BY matieres.id_matiere DESC
    `;

    const matieres = await sequelize.query(query, {
      replacements: { niveau: niveau },
      type: sequelize.QueryTypes.SELECT
    });

    res.json(matieres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des matières par niveau' });
  }
}

// Fonction pour récupérer une matière par son ID
async function getMatiereById(req, res) {
  try {
    const matiereId = req.params.matiereId;
    const matiere = await Matiere.findByPk(matiereId);
    if (!matiere) {
      res.status(404).json({ error: 'Matière non trouvée' });
      return;
    }
    res.json(matiere);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la matière par ID' });
  }
}

// Fonction pour mettre à jour une matière par son ID
async function updateMatiere(req, res) {
  try {
    const matiereId = req.params.matiereId;
    const matiereData = req.body;
    const matiere = await Matiere.findByPk(matiereId);
    if (!matiere) {
      res.status(404).json({ error: 'Matière non trouvée' });
      return;
    }
    await matiere.update(matiereData);
    res.json(matiere);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la matière' });
  }
}

// Fonction pour supprimer une matière par son ID
async function deleteMatiere(req, res) {
  try {
    const matiereId = req.params.matiereId;
    const matiere = await Matiere.findByPk(matiereId);
    if (!matiere) {
      res.status(404).json({ error: 'Matière non trouvée' });
      return;
    }
    await matiere.destroy();
    res.json(matiere);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la matière' });
  }
}

module.exports =  {
  createMatiere,
  getAllMatieres,
  getMatieresByNiveau,
  getMatiereById,
  updateMatiere,
  deleteMatiere,
};
