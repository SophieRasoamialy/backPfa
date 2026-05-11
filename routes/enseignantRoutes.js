const express = require('express');
const enseignantController = require('../controllers/enseignantController');

const router = express.Router();

/**
 * @swagger
 * /api/enseignants:
 *   get:
 *     tags: [Enseignants]
 *     summary: Lister les enseignants paginés
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *   post:
 *     tags: [Enseignants]
 *     summary: Créer un enseignant
 */
router.route('/')
  .get(enseignantController.getEnseignantsPagine)
  .post(enseignantController.create);

/**
 * @swagger
 * /api/enseignants/list:
 *   get:
 *     tags: [Enseignants]
 *     summary: Lister tous les enseignants
 */
router.get('/list', enseignantController.getAllEnseignants);

/**
 * @swagger
 * /api/enseignants/{enseignantId}:
 *   get:
 *     tags: [Enseignants]
 *     summary: Récupérer un enseignant
 *     parameters:
 *       - in: path
 *         name: enseignantId
 *         required: true
 *         schema:
 *           type: integer
 *   put:
 *     tags: [Enseignants]
 *     summary: Mettre à jour un enseignant
 *   delete:
 *     tags: [Enseignants]
 *     summary: Supprimer un enseignant
 */
router.route('/:enseignantId')
  .get(enseignantController.getById)
  .put(enseignantController.update)
  .delete(enseignantController.remove);

module.exports = router;
