const express = require('express');
const router = express.Router();
const Pointage = require("../models/pointage");

// Route pour créer un nouveau pointage
router.post('/', async (req, res) => {
  try {
    const { id_edt, id_etudiant, pointage_entre } = req.body;

    // Créez un nouveau pointage
    const nouveauPointage = await Pointage.create({ id_edt, id_etudiant, pointage_entre });
    res.status(201).json(nouveauPointage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du pointage' });
  }
});

// Route pour mettre à jour un pointage existant
router.put('/', async (req, res) => {
  try {
    const { id_edt, id_etudiant, pointage_sortie } = req.body;

    // Recherchez le pointage existant
    const existingPointage = await Pointage.findOne({
      where: { id_edt, id_etudiant },
    });

    if (existingPointage) {
      // Si le pointage existe, mettez à jour les données
      existingPointage.pointage_sortie = pointage_sortie;
      await existingPointage.save();
      res.json(existingPointage);
    } else {
      res.status(404).json({ error: 'Pointage non trouvé pour la mise à jour' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du pointage' });
  }
});


module.exports = router;
