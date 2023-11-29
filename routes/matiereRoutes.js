const express = require('express');
const router = express.Router();
const matiereController = require('../controllers/matiereController');

// Routes pour les matières
router.post('/', (req, res) => {
  matiereController.createMatiere(req, res);
});

router.get('/', (req, res) => {
  matiereController.getAllMatieres(req, res);
});

router.get('/niveau/:niveau', (req, res) => {
  matiereController.getMatieresByNiveau(req, res);
});

router.get('/:matiereId', (req, res) => {
  matiereController.getMatiereById(req, res);
});

router.put('/:matiereId', (req, res) => {
  matiereController.updateMatiere(req, res);
});

router.delete('/:matiereId', (req, res) => {
  matiereController.deleteMatiere(req, res);
});

module.exports = router;
