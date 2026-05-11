const express = require('express');
const salleController = require('../controllers/salleController');

const router = express.Router();

/**
 * @swagger
 * /api/salles:
 *   get:
 *     tags: [Salles]
 *     summary: Lister les salles
 *   post:
 *     tags: [Salles]
 *     summary: Créer une salle
 */
router.route('/')
  .get(salleController.list)
  .post(salleController.create);

/**
 * @swagger
 * /api/salles/{salleId}:
 *   get:
 *     tags: [Salles]
 *     summary: Récupérer une salle
 *     parameters:
 *       - in: path
 *         name: salleId
 *         required: true
 *         schema:
 *           type: integer
 *   put:
 *     tags: [Salles]
 *     summary: Mettre à jour une salle
 *   delete:
 *     tags: [Salles]
 *     summary: Supprimer une salle
 */
router.route('/:salleId')
  .get(salleController.getById)
  .put(salleController.update)
  .delete(salleController.remove);

module.exports = router;
