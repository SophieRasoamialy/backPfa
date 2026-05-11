const express = require('express');
const matiereController = require('../controllers/matiereController');

const router = express.Router();

/**
 * @swagger
 * /api/matieres:
 *   get:
 *     tags: [Matières]
 *     summary: Lister toutes les matières
 *   post:
 *     tags: [Matières]
 *     summary: Créer une matière
 */
router.route('/')
  .get(matiereController.list)
  .post(matiereController.create);

/**
 * @swagger
 * /api/matieres/niveau/{niveau}:
 *   get:
 *     tags: [Matières]
 *     summary: Lister les matières d'un niveau
 *     parameters:
 *       - in: path
 *         name: niveau
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/niveau/:niveau', matiereController.getMatieresByNiveau);

/**
 * @swagger
 * /api/matieres/{matiereId}:
 *   get:
 *     tags: [Matières]
 *     summary: Récupérer une matière
 *     parameters:
 *       - in: path
 *         name: matiereId
 *         required: true
 *         schema:
 *           type: integer
 *   put:
 *     tags: [Matières]
 *     summary: Mettre à jour une matière
 *   delete:
 *     tags: [Matières]
 *     summary: Supprimer une matière
 */
router.route('/:matiereId')
  .get(matiereController.getById)
  .put(matiereController.update)
  .delete(matiereController.remove);

module.exports = router;
