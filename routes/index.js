const express = require('express');
const router = express.Router();

const niveauRoutes = require('./niveauRoutes');
const matiereRoutes = require('./matiereRoutes');
const enseignantRoutes = require('./enseignantRoutes');
const etudiantRoutes = require('./etudiantRoutes');
const edtRoutes = require('./emploieTempsRoutes');
const salleRoutes = require('./salleRoutes');
const pointageRoutes = require('./pointageRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/niveaux', niveauRoutes);
router.use('/matieres', matiereRoutes);
router.use('/enseignants', enseignantRoutes);
router.use('/etudiants', etudiantRoutes);
router.use('/edt', edtRoutes);
router.use('/salles', salleRoutes);
router.use('/pointages', pointageRoutes);
router.use('/admins', adminRoutes);

module.exports = router;
