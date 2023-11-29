const Etudiant = require('../models/etudiant');
const EmploiDuTemps = require('../models/emploidutemps');
const etudiant = require('../models/etudiant');
const Pointage = require('../models/pointage');
const { Op } = require('sequelize');
const sequelize =  require('../config/sequelize');
const { QueryTypes } = require('sequelize');

// Fonction pour créer un nouvel étudiant
async function createEtudiant(req, res) {
  try {
    const etudiantData = req.body; // Récupérer les données du corps de la requête
    const nouvelleEtudiant = await Etudiant.create(etudiantData);
    res.json(nouvelleEtudiant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'etudiant' });
  }
}

// Fonction pour récupérer tous les étudiants
async function getAllEtudiants(req, res) {
  try {
    const etudiants = await Etudiant.findAll();
    res.json(etudiants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de toutes les matières' });
  }
}

// Fonction pour vérifier si un étudiant existe par son ID
async function checkIfEtudiantExists(req, res) {
  try {
    const etudiantId = req.params.etudiantId;
    const etudiant = await Etudiant.findByPk(etudiantId);

    if (etudiant) {
      res.json({ exists: true, message: 'Étudiant trouvé' });
    } else {
      res.json({ exists: false, message: 'Étudiant non trouvé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la vérification de l\'étudiant par ID' });
  }
}



async function getAbsentStudentTimetable(req, res) {
  try {
    const etudiantId = req.params.etudiantId;

    const query = `
    SELECT emploidutemps.date, emploidutemps.heure, matieres.id_matiere, matieres.matiere
    FROM emploidutemps
    INNER JOIN matieres ON emploidutemps.id_matiere = matieres.id_matiere
    LEFT JOIN pointages ON emploidutemps.id_edt = pointages.id_edt AND pointages.id_etudiant = :etudiantId
    WHERE emploidutemps.id_niveau = (SELECT id_niveau FROM etudiants WHERE id_etudiant = :etudiantId)
      AND pointages.id_pointage IS NULL
    `;

    const studentTimetable = await sequelize.query(query, {
      replacements: { etudiantId },
      type: QueryTypes.SELECT
    });

    res.json(studentTimetable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des absences de l\'étudiant' });
  }
}


// Fonction pour mettre à jour un étudiant par son ID
async function updateEtudiant(req, res) {

  try {
    const etudiantId = req.params.etudiantId;
    const etudiantData = req.body;
    const etudiant = await Etudiant.findByPk(etudiantId);
    if (!etudiant) {
      res.status(404).json({ error: 'Etudiant non trouvée' });
      return;
    }
    await etudiant.update(etudiantData);
    res.json(etudiant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'etudiant' });
  }

}

// Fonction pour récupérer un etudiant par son ID
async function getEtudiantById(req, res) {
  try {
    const etudiantd = req.params.etudiantId;
    const etudiant = await Etudiant.findByPk(etudiantd);
    if (!etudiant) {
      res.status(404).json({ error: 'Etudiant non trouvée' });
      return;
    }
    res.json(etudiant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'etudiant par ID' });
  }

}
// Fonction pour supprimer un étudiant par son ID
async function deleteEtudiant(req, res) {

  try {
    const etudiantId = req.params.etudiantId;
    const etudiant = await Etudiant.findByPk(etudiantId);
    if (!etudiant) {
      res.status(404).json({ error: 'Etudiant non trouvée' });
      return;
    }
    await etudiant.destroy();
    res.json(etudiant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'etudiant ' });
  }
}

async function getStudentsWithAbsenceCountByLevel(levelId) {
    try {
      const students = await Etudiant.findAll({ where: { id_niveau: levelId }, order: [['id_etudiant', 'DESC'] 
      ] });
      const currentTimetable = await EmploiDuTemps.findAll({ where: { id_niveau: levelId } });
  
      const absentCounts = {};
  
      students.forEach(student => {
        absentCounts[student.id_etudiant] = 0;
      });
  
      const studentsWithStatusAndAbsenceCount = [];
  
      for (const student of students) {
        absentCounts[student.id_etudiant] = 0;
  
        let studentStatus = 'Pas en classe';
  
        for (const timetable of currentTimetable) {
          const entryAttendance = await Pointage.findOne({
            where: {
              id_etudiant: student.id_etudiant,
              id_edt: timetable.id_edt,
              pointage_entre: {
                [Op.lte]: new Date(), // Vérifier l'heure actuelle
              },
            },
          });
  
          if (!entryAttendance) {
            absentCounts[student.id_etudiant]++; // Incrémenter le compteur d'absences
          } else {
            const exitAttendance = await Pointage.findOne({
              where: {
                id_etudiant: student.id_etudiant,
                id_edt: timetable.id_edt,
                pointage_sortie: {
                  [Op.lte]: new Date(), // Vérifier l'heure actuelle
                },
              },
            });
  
            if (entryAttendance && !exitAttendance) {
              studentStatus = 'En classe';
              break; // Sortir de la boucle dès qu'on détermine "En classe"
            }
          }
        }
  
        studentsWithStatusAndAbsenceCount.push({
          id_etudiant: student.id_etudiant,
          nom_etudiant: student.nom_etudiant,
          prenom_etudiant: student.prenom_etudiant,
          nombre_absences: absentCounts[student.id_etudiant],
          status: studentStatus,
        });
      }
  
      return studentsWithStatusAndAbsenceCount;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function getAbsenceCountForStudent(req, res) {
    try {
      const etudiantId = req.params.etudiantId;
      const absenceCount = await Pointage.count({
        where: {
          id_etudiant: etudiantId,
          pointage_entre: {
            [Op.lte]: new Date(), // Vérifier l'heure actuelle
          },
        },
      });
  
      res.json(absenceCount);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async function getPresenceCountForStudent(req, res) {
    try {
      const etudiantId = req.params.etudiantId;
      const presenceCount = await Pointage.count({
        where: {
          id_etudiant: etudiantId,
          pointage_sortie: {
            [Op.lte]: new Date(), // Vérifier l'heure actuelle
          },
        },
      });
  
      res.json(presenceCount);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  
  

  module.exports = {
  createEtudiant,
  getAllEtudiants,
  getAbsentStudentTimetable,
  getEtudiantById,
  updateEtudiant,
  deleteEtudiant,
  getStudentsWithAbsenceCountByLevel,
  checkIfEtudiantExists,
  getAbsenceCountForStudent,
  getPresenceCountForStudent,
};
