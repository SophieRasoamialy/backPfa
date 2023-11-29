const express = require('express');
const router = express.Router();
const emploiTempsController = require('../controllers/edtControlleur');

// Route pour créer un nouvel emploi du temps
router.post('/', emploiTempsController.createEmploiTemps);

// Route pour récupérer tous les emplois du temps par niveau
router.get('/:niveau', emploiTempsController.getAllEmploiTemps);

// Route pour récupérer un emploi du temps par son ID
router.get('/id/:edtId', emploiTempsController.getEmploiTempsById);

// Route pour mettre à jour un emploi du temps par son ID
router.put('/:edtId', emploiTempsController.updateEmploiTemps);

// Route pour supprimer un emploi du temps par son ID
router.delete('/:edtId', emploiTempsController.deleteEmploiTemps);

module.exports = router;
