const express = require('express');
const niveauController = require('../controllers/niveauController');

const router = express.Router();

/**
 * @swagger
 * /api/niveaux:
 *   get:
 *     tags: [Niveaux]
 *     summary: Lister les niveaux
 *   post:
 *     tags: [Niveaux]
 *     summary: Créer un niveau
 */
router.route('/')
  .get(niveauController.list)
  .post(niveauController.create);

/**
 * @swagger
 * /api/niveaux/{niveauId}:
 *   get:
 *     tags: [Niveaux]
 *     summary: Récupérer un niveau
 *     parameters:
 *       - in: path
 *         name: niveauId
 *         required: true
 *         schema:
 *           type: integer
 *   put:
 *     tags: [Niveaux]
 *     summary: Mettre à jour un niveau
 *   delete:
 *     tags: [Niveaux]
 *     summary: Supprimer un niveau
 */
router.route('/:niveauId')
  .get(niveauController.getById)
  .put(niveauController.update)
  .delete(niveauController.remove);

module.exports = router;
