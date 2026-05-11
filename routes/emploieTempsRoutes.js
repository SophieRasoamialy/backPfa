const express = require('express');
const emploiTempsController = require('../controllers/edtControlleur');

const router = express.Router();

/**
 * @swagger
 * /api/edt:
 *   post:
 *     tags: [Emploi du temps]
 *     summary: Créer un emploi du temps
 */
router.post('/', emploiTempsController.create);

/**
 * @swagger
 * /api/edt/etudiant/{niveau}:
 *   get:
 *     tags: [Emploi du temps]
 *     summary: Lister l'emploi du temps d'un étudiant pour un niveau
 */
router.get('/etudiant/:niveau', emploiTempsController.getAllEmploiTempsEtudiant);

/**
 * @swagger
 * /api/edt/id/{edtId}:
 *   get:
 *     tags: [Emploi du temps]
 *     summary: Récupérer un emploi du temps par identifiant
 *   put:
 *     tags: [Emploi du temps]
 *     summary: Mettre à jour un emploi du temps
 *   delete:
 *     tags: [Emploi du temps]
 *     summary: Supprimer un emploi du temps
 */
router.get('/id/:edtId', emploiTempsController.getById);
router.put('/id/:edtId', emploiTempsController.update);
router.delete('/id/:edtId', emploiTempsController.remove);

/**
 * @swagger
 * /api/edt/{niveau}:
 *   get:
 *     tags: [Emploi du temps]
 *     summary: Lister les emplois du temps d'un niveau entre deux dates
 */
router.get('/:niveau', emploiTempsController.getAllEmploiTemps);

module.exports = router;
