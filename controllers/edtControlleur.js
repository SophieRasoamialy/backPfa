const EmploiTemps = require('../models/emploidutemps');
const sequelize = require('../config/sequelize');
const { QueryTypes } = require('sequelize');


// Fonction pour créer un nouvel emploi du temps
async function createEmploiTemps(req, res) {
    try {
        const edtData = req.body; // Récupérer les données du corps de la requête
        const nouvelleEdt = await EmploiTemps.create(edtData);
        res.json(nouvelleEdt);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'edt ' });
      }
}

// Fonction pour récupérer tous les emplois du temps par niveau et date
async function getAllEmploiTemps(req, res) {
  try {
    const niveauId = req.params.niveau;
    const startDate = req.query.date1; // Récupérer la date depuis les paramètres de requête
    const endDate = req.query.date2;

    const query = `
      SELECT edt.id_edt, edt.date, edt.heure, edt.id_matiere, mat.matiere, salle.num_salle, mat.id_enseignant, enseignant.nom_enseignant, enseignant.prenom_enseignant
      FROM emploidutemps edt
      INNER JOIN matieres mat ON edt.id_matiere = mat.id_matiere
      INNER JOIN salles salle ON edt.id_salle = salle.num_salle
      INNER JOIN enseignants enseignant ON mat.id_enseignant = enseignant.id_enseignant
      WHERE edt.id_niveau = :niveauId
         AND DATE(edt.date) BETWEEN :startDate AND :endDate`; // Ajout de la condition de date

    const emploisTemps = await sequelize.query(query, {
      replacements: { niveauId, startDate, endDate },
      type: sequelize.QueryTypes.SELECT,
    });

    res.json(emploisTemps);
  } catch (error) {
    throw error;
  }
}


// Fonction pour récupérer un emploi du temps par son ID avec une requête SQL
async function getEmploiTempsById(req, res) {
  try {
    const edtId = req.params.edtId;
    const edt = await EmploiTemps.findByPk(edtId);
    if (!edt) {
      res.status(404).json({ error: 'Emploie du temps non trouvée' });
      return;
    }
    res.json(edt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'emploie du temps par ID' });
  }
}

// Fonction pour mettre à jour un emploi du temps par son ID
async function updateEmploiTemps(req, res) {
    try {
        const edtId = req.params.edtId;
        const edtData = req.body;
        const edt = await EmploiTemps.findByPk(edtId);
        if (!edt) {
          res.status(404).json({ error: 'Emploie du temps non trouvée' });
          return;
        }
        await edt.update(edtData);
        res.json(edt);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'emploie du temps ' });
      }
}

// Fonction pour supprimer un emploi du temps par son ID
async function deleteEmploiTemps(req, res) {
    try {
        const edtId = req.params.edtId;
        const edt = await EmploiTemps.findByPk(edtId);
        if (!edt) {
          res.status(404).json({ error: 'Emploie du temps non trouvée' });
          return;
        }
        await edt.destroy();
        res.json(edt);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'emploie du temps ' });
      }
}

module.exports =  {
  createEmploiTemps,
  getAllEmploiTemps,
  getEmploiTempsById,
  updateEmploiTemps,
  deleteEmploiTemps,
};
