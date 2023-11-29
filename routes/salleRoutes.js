const express = require('express');
const router = express.Router();
const salleController = require('../controllers/salleController');

// Routes
router.post('/', (req, res) => {
  salleController.createSalle(req, res); // Appel de la fonction avec req et res
});

router.get('/', (req, res) => {
  salleController.getAllSalles(req, res); // Appel de la fonction avec req et res
});

router.get('/:salleId', (req, res) => {
  salleController.getSalleById(req, res); // Appel de la fonction avec req et res
});

router.put('/:salleId', (req, res) => {
  salleController.updateSalle(req, res); // Appel de la fonction avec req et res
});

router.delete('/:salleId', (req, res) => {
  salleController.deleteSalle(req, res); // Appel de la fonction avec req et res
});

module.exports = router;
