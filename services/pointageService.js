const Pointage = require('../models/pointage');
const AppError = require('../utils/appError');

async function createPointage(payload) {
  const { id_edt, id_etudiant, pointage_entre } = payload;

  if (!id_edt || !id_etudiant || !pointage_entre) {
    throw new AppError('id_edt, id_etudiant et pointage_entre sont requis', 400);
  }

  return Pointage.create({ id_edt, id_etudiant, pointage_entre });
}

async function closePointage(payload) {
  const { id_edt, id_etudiant, pointage_sortie } = payload;

  if (!id_edt || !id_etudiant || !pointage_sortie) {
    throw new AppError('id_edt, id_etudiant et pointage_sortie sont requis', 400);
  }

  const pointage = await Pointage.findOne({
    where: { id_edt, id_etudiant },
  });

  if (!pointage) {
    throw new AppError('Pointage non trouvé pour la mise à jour', 404);
  }

  pointage.pointage_sortie = pointage_sortie;
  await pointage.save();

  return pointage;
}

module.exports = {
  createPointage,
  closePointage,
};
