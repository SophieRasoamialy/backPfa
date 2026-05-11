const express = require('express');
const router = express.Router();
const pointageController = require('../controllers/pointageController');

/**
 * @swagger
 * /api/pointages:
 *   post:
 *     tags: [Pointages]
 *     summary: Créer un pointage d'entrée
 *   put:
 *     tags: [Pointages]
 *     summary: Mettre à jour le pointage de sortie
 */
router.post('/', pointageController.createPointage);
router.put('/', pointageController.closePointage);


module.exports = router;
