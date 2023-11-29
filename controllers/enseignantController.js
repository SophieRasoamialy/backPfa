const Enseignant = require('../models/enseignant');
const sequelize = require('../config/sequelize');
const { QueryTypes } = require('sequelize');


// Fonction pour créer un nouvel enseignant
async function createEnseignant(req, res) {
  try {
    const enseignantData = req.body;
    const nouvelEnseignant = await Enseignant.create(enseignantData);
    res.json(nouvelEnseignant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'enseignant' });
  }
}

async function getAllEnseignants(req, res) {
  try {
    const enseignants = await Enseignant.findAll();
    res.json(enseignants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de toutes les enseignants' });
  }
}

// Fonction pour récupérer les enseignants paginés
async function getEnseignantsPagine(req, res) {
  const page = parseInt(req.query.page) || 1; // Page demandée (par défaut 1)
  const limit = parseInt(req.query.limit) || 10; // Nombre d'enseignants par page (par défaut 10)

  const offset = (page - 1) * limit; // Offset pour paginer

  try {
    const enseignants = await sequelize.query(
      `SELECT e.id_enseignant as id_enseignant, e.nom_enseignant as nom_enseignant, e.prenom_enseignant as prenom_enseignant, GROUP_CONCAT(m.matiere SEPARATOR ', ')  as matiere, m.id_matiere as id_matiere
      FROM enseignants e
      LEFT JOIN matieres m ON e.id_enseignant = m.id_enseignant 
      GROUP BY e.id_enseignant, e.nom_enseignant, e.prenom_enseignant
      ORDER BY e.id_enseignant DESC
      LIMIT :limit OFFSET :offset `,
      { replacements: { limit, offset }, type: QueryTypes.SELECT }
    );

    res.json(enseignants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération paginée de tous les enseignants avec leurs matières' });
  }
}


// Fonction pour récupérer un enseignant par son ID
async function getEnseignantById(req, res) {
  try {
    const enseignantId = req.params.enseignantId;
    const enseignant = await Enseignant.findByPk(enseignantId);
    if (!enseignant) {
      res.status(404).json({ error: 'Enseignant non trouvé' });
      return;
    }
    res.json(enseignant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'enseignant par ID' });
  }
}

// Fonction pour mettre à jour un enseignant par son ID
async function updateEnseignant(req, res) {
  try {
    const enseignantId = req.params.enseignantId;
    const enseignantData = req.body;
    const enseignant = await Enseignant.findByPk(enseignantId);
    if (!enseignant) {
      res.status(404).json({ error: 'Enseignant non trouvé' });
      return;
    }
    await enseignant.update(enseignantData);
    res.json(enseignant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'enseignant' });
  }
}


// Fonction pour supprimer un enseignant par son ID
async function deleteEnseignant(req, res) {
  try {
    const enseignantId = req.params.enseignantId;
    const enseignant = await Enseignant.findByPk(enseignantId);
    if (!enseignant) {
      res.status(404).json({ error: 'Enseignant non trouvé' });
      return;
    }
    await enseignant.destroy();
    res.json(enseignant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'enseignant' });
  }
}

module.exports =  {
  getAllEnseignants,
  createEnseignant,
  getEnseignantsPagine,
  getEnseignantById,
  updateEnseignant,
  deleteEnseignant,
};
