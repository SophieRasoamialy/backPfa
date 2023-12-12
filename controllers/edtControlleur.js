const EmploiTemps = require('../models/emploidutemps');
const sequelize = require('../config/sequelize');
const { QueryTypes } = require('sequelize');
const Pointage = require('../models/pointage');


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
    const startDate = req.query.date1;
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

async function getAllEmploiTempsEtudiant(req, res) {
  try {
    const niveauId = req.params.niveau;
    const startDate = req.query.date1;
    const endDate = req.query.date2;
    const query = `
      SELECT edt.id_edt, edt.date, edt.heure,edt.heure_fin, edt.id_matiere, mat.matiere, salle.num_salle, mat.id_enseignant, enseignant.nom_enseignant, enseignant.prenom_enseignant
      FROM emploidutemps edt
      INNER JOIN matieres mat ON edt.id_matiere = mat.id_matiere
      INNER JOIN salles salle ON edt.id_salle = salle.num_salle
      INNER JOIN enseignants enseignant ON mat.id_enseignant = enseignant.id_enseignant
      WHERE edt.id_niveau = :niveauId
         AND DATE(edt.date) BETWEEN :startDate AND :endDate`;

    const emploisTemps = await sequelize.query(query, {
      replacements: { niveauId, startDate, endDate },
      type: sequelize.QueryTypes.SELECT,
    });

    const emploisTempsWithPresence = await Promise.all(
      emploisTemps.map(async (edt) => {
        const isPresent = await checkIfEtudiantPresentInEdt(req.query.id_etudiant, edt.id_edt);
        const isEntranceOnly = await checkIfEtudiantEntranceOnly(req.query.id_etudiant, edt.id_edt);

        return {
          ...edt,
          isPresent,
          isEntranceOnly,
        };
      })
    );

    res.json(emploisTempsWithPresence);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des emplois du temps avec vérification de la présence' });
  }
}

async function checkIfEtudiantPresentInEdt(id_etudiant, id_edt) {
  try {
    const pointage = await Pointage.findOne({
      where: { id_etudiant, id_edt },
    });

    if (pointage && pointage.pointage_entree !== null && pointage.pointage_sortie !== null) {
      return { present: true, message: 'Étudiant présent dans l\'emploi du temps avec des horaires valides' };
    } else {
      return { present: false, message: 'Étudiant non présent dans l\'emploi du temps ou horaires de pointage manquants' };
    }
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la vérification de la présence de l\'étudiant dans l\'emploi du temps');
  }
}

async function checkIfEtudiantEntranceOnly(id_etudiant, id_edt) {
  try {
    // Recherchez le pointage de l'étudiant pour l'emploi du temps spécifié
    const pointage = await Pointage.findOne({
      where: { id_etudiant, id_edt },
    });

    if (pointage && pointage.pointage_entree !== null && pointage.pointage_sortie === null) {
      return { entranceOnly: true, message: 'Étudiant a seulement fait un pointage d\'entrée' };
    } else {
      return { entranceOnly: false, message: 'Étudiant n\'a pas fait uniquement un pointage d\'entrée ou pointage manquant' };
    }
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la vérification du pointage d\'entrée uniquement pour l\'étudiant');
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
  getAllEmploiTempsEtudiant
  ,
};
