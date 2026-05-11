const express = require('express');
const etudiantController = require('../controllers/etudiantController');

const router = express.Router();

/**
 * @swagger
 * /api/etudiants:
 *   get:
 *     tags: [Étudiants]
 *     summary: Lister les étudiants
 *   post:
 *     tags: [Étudiants]
 *     summary: Créer un étudiant
 */
router.route('/')
  .get(etudiantController.getAllEtudiants)
  .post(etudiantController.create);

router.get('/etudiants', etudiantController.getAllEtudiants);
router.get('/check/:etudiantId', etudiantController.checkIfEtudiantExists);
router.get('/niveau/:levelId/etudiants', etudiantController.getStudentsWithAbsenceCountByLevelHandler);
router.get('/etudiant/:etudiantId/absence-count', etudiantController.getAbsenceCountForStudent);
router.get('/etudiant/:etudiantId/presence-count', etudiantController.getPresenceCountForStudent);
router.get('/etudiant/:etudiantId/past-courses-count', etudiantController.getPastCoursesCountForStudent);
router.get('/etudiant/:etudiantId/unattended-courses', etudiantController.getUnattendedCoursesForStudent);
router.get('/etudiant/:etudiantId/absences', etudiantController.getAbsentStudentTimetable);
router.get('/etudiants/:etudiantId', etudiantController.getAbsentStudentTimetable);
router.get('/etudiant-present/:id_etudiant/:id_edt', etudiantController.checkIfEtudiantPresentInEdt);
router.get('/etudiant-entrance-only/:id_etudiant/:id_edt', etudiantController.checkIfEtudiantEntranceOnly);
router.get('/:etudiantId/photo', etudiantController.getPhotoEtudiantById);

/**
 * @swagger
 * /api/etudiants/{etudiantId}:
 *   get:
 *     tags: [Étudiants]
 *     summary: Récupérer un étudiant
 *     parameters:
 *       - in: path
 *         name: etudiantId
 *         required: true
 *         schema:
 *           type: integer
 *   put:
 *     tags: [Étudiants]
 *     summary: Mettre à jour un étudiant
 *   delete:
 *     tags: [Étudiants]
 *     summary: Supprimer un étudiant
 */
router.route('/:etudiantId')
  .get(etudiantController.getById)
  .put(etudiantController.update)
  .delete(etudiantController.remove);

module.exports = router;
