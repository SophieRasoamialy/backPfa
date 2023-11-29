const express = require('express');
const router = express.Router();
const niveauController = require('../controllers/niveauController');

// Routes
router.post('/', (req, res) => {
  niveauController.createNiveau(req, res); // Appel de la fonction avec req et res
});

router.get('/', (req, res) => {
  niveauController.getAllNiveaux(req, res); // Appel de la fonction avec req et res
});

router.get('/:niveauId', (req, res) => {
  niveauController.getNiveauById(req, res); // Appel de la fonction avec req et res
});

router.put('/:niveauId', (req, res) => {
  niveauController.updateNiveau(req, res); // Appel de la fonction avec req et res
});

router.delete('/:niveauId', (req, res) => {
  niveauController.deleteNiveau(req, res); // Appel de la fonction avec req et res
});

module.exports = router;
