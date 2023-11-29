const express = require('express');
const router = express.Router();
const enseignantController = require('../controllers/enseignantController');

// Routes pour les enseignants
router.post('/', (req, res) => {
  enseignantController.createEnseignant(req, res);
});

router.get('/', (req, res) => {
  enseignantController.getEnseignantsPagine(req, res);
});

router.get('/list', (req,res) => {
  enseignantController.getAllEnseignants(req,res);
});

router.get('/:enseignantId', (req, res) => {
  enseignantController.getEnseignantById(req, res);
});

router.put('/:enseignantId', (req, res) => {
  enseignantController.updateEnseignant(req, res);
});

router.delete('/:enseignantId', (req, res) => {
  enseignantController.deleteEnseignant(req, res);
});

module.exports = router;
