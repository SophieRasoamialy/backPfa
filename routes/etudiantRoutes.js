const express = require('express');
const router = express.Router();
const EtudiantController = require('../controllers/etudiantController');

// Route pour créer un nouvel étudiant
router.post('/', EtudiantController.createEtudiant);

// Route pour récupérer tous les étudiants
router.get('/etudiants', EtudiantController.getAllEtudiants);

// Route pour récupérer un étudiant par son ID
router.get('/etudiants/:etudiantId', EtudiantController.getAbsentStudentTimetable);

router.get('/:etudiantId',EtudiantController.getEtudiantById);

// Route pour mettre à jour un étudiant par son ID
router.put('/:etudiantId', EtudiantController.updateEtudiant);

router.get('/check/:etudiantId', EtudiantController.checkIfEtudiantExists);

// Route pour supprimer un étudiant par son ID
router.delete('/:etudiantId', EtudiantController.deleteEtudiant);

// Exemple d'une route pour obtenir les étudiants par niveau avec leur statut de présence
router.get('/niveau/:levelId/etudiants', async (req, res) => {
  const levelId = req.params.levelId;
  try {
    const attendanceStatus = await EtudiantController.getStudentsWithAbsenceCountByLevel(levelId);
    res.json(attendanceStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des étudiants par niveau' });
  }
});

router.get('/etudiant/:etudiantId/absence-count', EtudiantController.getAbsenceCountForStudent);
router.get('/etudiant/:etudiantId/presence-count', EtudiantController.getPresenceCountForStudent);
// Route pour récupérer le nombre de cours passés pour un étudiant
router.get('/etudiant/:etudiantId/past-courses-count', EtudiantController.getPastCoursesCountForStudent);
// Route pour obtenir la liste des cours non suivis par l'étudiant
router.get('/etudiant/:etudiantId/unattended-courses', EtudiantController.getUnattendedCoursesForStudent);

// Route pour vérifier si un étudiant est présent dans un emploi du temps spécifié
router.get('/etudiant-present/:id_etudiant/:id_edt', EtudiantController.checkIfEtudiantPresentInEdt);

// Route pour vérifier si un étudiant a seulement fait un pointage d'entrée dans un emploi du temps spécifié
router.get('/etudiant-entrance-only/:id_etudiant/:id_edt', EtudiantController.checkIfEtudiantEntranceOnly);

// Route pour récupérer le chemin de la photo d'un étudiant par son ID
router.get('/:etudiantId/photo', EtudiantController.getPhotoEtudiantById);


module.exports = router;
