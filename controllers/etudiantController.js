const Etudiant = require('../models/etudiant');
const EmploiDuTemps = require('../models/emploidutemps');
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
                [Op.lte]: new Date(), 
              },
            },
          });
  
          if (!entryAttendance) {
            absentCounts[student.id_etudiant]++; 
          } else {
            const exitAttendance = await Pointage.findOne({
              where: {
                id_etudiant: student.id_etudiant,
                id_edt: timetable.id_edt,
                pointage_sortie: {
                  [Op.lte]: new Date(), 
                },
              },
            });
  
            if (entryAttendance && !exitAttendance) {
              studentStatus = 'En classe';
              break; 
            }
          }
        }
  
        studentsWithStatusAndAbsenceCount.push({
          id_etudiant: student.id_etudiant,
          nom_etudiant: student.nom_etudiant,
          prenom_etudiant: student.prenom_etudiant,
          photo_etudiant: student.photo_etudiant,
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

        // Obtenir le nombre de présences de l'étudiant
        const presenceCount = await getPresenceCountForStudentHelper(etudiantId);

        // Obtenir le nombre de cours passés de l'étudiant
        const pastCoursesCount = await getPastCoursesCountForStudentHelper(etudiantId);

        // Calculer le nombre d'absences en soustrayant le nombre de présences du nombre total de cours passés
        const absenceCount = pastCoursesCount - presenceCount;

        res.json(absenceCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du nombre d\'absences pour l\'étudiant' });
    }
}


// Fonction pour obtenir le nombre de présences de l'étudiant
async function getPresenceCountForStudentHelper(etudiantId) {
  try {
      // Compter le nombre d'occurrences dans la table Pointage
      const presenceCount = await Pointage.count({
          where: {
              id_etudiant: etudiantId,
          },
      });

      return presenceCount;
  } catch (error) {
      console.error(error);
      throw error;
  }
}

// Fonction pour obtenir le nombre de cours passés de l'étudiant
async function getPastCoursesCountForStudentHelper(etudiantId) {
  try {
      // Récupérer tous les cours passés de l'étudiant
      const pastCoursesCount = await EmploiDuTemps.count({
          where: {
              id_niveau: {
                  [Op.in]: sequelize.literal(`(SELECT id_niveau FROM etudiants WHERE id_etudiant = ${etudiantId})`)
              },
              date: {
                  [Op.lt]: new Date(), // Vérifier la date actuelle
              },
          },
      });

      return pastCoursesCount;
  } catch (error) {
      console.error(error);
      throw error;
  }
}
  async function getPresenceCountForStudent(req, res) {
    try {
        const etudiantId = req.params.etudiantId;

        // Compter le nombre d'occurrences dans la table Pointage
        const presenceCount = await Pointage.count({
            where: {
                id_etudiant: etudiantId,
            },
        });

        res.json(presenceCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du nombre de présences pour l\'étudiant' });
    }
}


async function getPastCoursesCountForStudent(req, res) {
  try {
      const etudiantId = req.params.etudiantId;

      // Récupérer tous les cours passés de l'étudiant
      const pastCoursesCount = await EmploiDuTemps.count({
          where: {
              id_niveau: {
                  [Op.in]: sequelize.literal(`(SELECT id_niveau FROM etudiants WHERE id_etudiant = ${etudiantId})`)
              },
              date: {
                  [Op.lt]: new Date(), // Vérifier la date actuelle
              },
          },
      });

      res.json(pastCoursesCount);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération du nombre de cours passés pour l\'étudiant' });
  }
}

async function getUnattendedCoursesForStudent(req, res) {
  try {
      const etudiantId = req.params.etudiantId;

      // Utiliser une requête SQL pour obtenir les cours passés de l'étudiant sans pointage associé
      const unattendedCourses = await sequelize.query(
          `SELECT edt.*, m.matiere, e.nom_enseignant, e.prenom_enseignant
          FROM emploidutemps edt
          LEFT JOIN pointages p ON edt.id_edt = p.id_edt AND p.id_etudiant = :etudiantId
          LEFT JOIN matieres m ON edt.id_matiere = m.id_matiere
          LEFT JOIN enseignants e ON m.id_enseignant = e.id_enseignant
          WHERE edt.id_niveau IN (SELECT id_niveau FROM etudiants WHERE id_etudiant = :etudiantId)
            AND edt.date < NOW()
            AND p.id_edt IS NULL`,
          {
              type: QueryTypes.SELECT,
              replacements: { etudiantId: etudiantId },
              model: EmploiDuTemps, // Indiquez le modèle EmploiDuTemps pour que Sequelize mappe les résultats
          }
      );

      res.json(unattendedCourses);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des cours non suivis pour l\'étudiant' });
  }
}

async function checkIfEtudiantPresentInEdt(req, res) {
  try {
    const { id_etudiant, id_edt } = req.params;

    // Recherchez le pointage de l'étudiant pour l'emploi du temps spécifié
    const pointage = await Pointage.findOne({
      where: { id_etudiant, id_edt },
    });

    if (pointage && pointage.pointage_entree !== null && pointage.pointage_sortie !== null) {
      res.json({ present: true, message: 'Étudiant présent dans l\'emploi du temps avec des horaires valides' });
    } else {
      res.json({ present: false, message: 'Étudiant non présent dans l\'emploi du temps ou horaires de pointage manquants' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la vérification de la présence de l\'étudiant dans l\'emploi du temps' });
  }
}

async function checkIfEtudiantEntranceOnly(req, res) {
  try {
    const { id_etudiant, id_edt } = req.params;

    // Recherchez le pointage de l'étudiant pour l'emploi du temps spécifié
    const pointage = await Pointage.findOne({
      where: { id_etudiant, id_edt },
    });

    if (pointage && pointage.pointage_entree !== null && pointage.pointage_sortie === null) {
      res.json({ entranceOnly: true, message: 'Étudiant a seulement fait un pointage d\'entrée' });
    } else {
      res.json({ entranceOnly: false, message: 'Étudiant n\'a pas fait uniquement un pointage d\'entrée ou pointage manquant' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la vérification du pointage d\'entrée uniquement pour l\'étudiant' });
  }
}

// Fonction pour récupérer le chemin de la photo d'un étudiant par son ID
async function getPhotoEtudiantById(req, res) {
  const etudiantId = req.params.etudiantId;

  try {
    const etudiant = await Etudiant.findByPk(etudiantId);

    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé.' });
    }

    const photoPath = etudiant.photo_etudiant;

    if (!photoPath) {
      return res.status(404).json({ message: 'Aucun chemin de photo trouvé pour cet étudiant.' });
    }
    res.json({ photoPath });
  } catch (error) {
    console.error('Erreur lors de la récupération du chemin de la photo de l\'étudiant', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du chemin de la photo de l\'étudiant.' });
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
  getPastCoursesCountForStudent,
  getPastCoursesCountForStudentHelper,
  getPresenceCountForStudentHelper,
  getUnattendedCoursesForStudent,
  checkIfEtudiantPresentInEdt,
  checkIfEtudiantEntranceOnly,
  getPhotoEtudiantById,
};
