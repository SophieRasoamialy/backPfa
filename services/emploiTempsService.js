const { QueryTypes } = require('sequelize');

const EmploiDuTemps = require('../models/emploidutemps');
const Pointage = require('../models/pointage');
const sequelize = require('../config/sequelize');
const createCrudService = require('./crudService');

const crudService = createCrudService(EmploiDuTemps, {
  idField: 'id_edt',
  entityLabel: 'Emploi du temps',
});

function buildPresencePayload(pointage) {
  return {
    present: Boolean(pointage && pointage.pointage_entre && pointage.pointage_sortie),
    entranceOnly: Boolean(pointage && pointage.pointage_entre && !pointage.pointage_sortie),
  };
}

async function listByNiveauAndDateRange(niveauId, startDate, endDate) {
  const query = `
    SELECT edt.id_edt, edt.date, edt.heure, edt.heure_fin, edt.id_niveau,
           edt.id_matiere, edt.id_salle, mat.matiere, salle.num_salle,
           mat.id_enseignant, enseignant.nom_enseignant, enseignant.prenom_enseignant
    FROM EmploiDuTemps edt
    INNER JOIN Matieres mat ON edt.id_matiere = mat.id_matiere
    INNER JOIN Salles salle ON edt.id_salle = salle.num_salle
    INNER JOIN Enseignants enseignant ON mat.id_enseignant = enseignant.id_enseignant
    WHERE edt.id_niveau = :niveauId
      AND DATE(edt.date) BETWEEN :startDate AND :endDate
    ORDER BY edt.date ASC, edt.heure ASC
  `;

  return sequelize.query(query, {
    replacements: { niveauId, startDate, endDate },
    type: QueryTypes.SELECT,
  });
}

async function listStudentTimetable(niveauId, startDate, endDate, etudiantId) {
  const emploisTemps = await listByNiveauAndDateRange(niveauId, startDate, endDate);

  if (!etudiantId || emploisTemps.length === 0) {
    return emploisTemps;
  }

  const pointages = await Pointage.findAll({
    where: {
      id_etudiant: etudiantId,
      id_edt: emploisTemps.map((item) => item.id_edt),
    },
  });

  const pointageMap = new Map(
    pointages.map((pointage) => [`${pointage.id_etudiant}:${pointage.id_edt}`, pointage])
  );

  return emploisTemps.map((emploi) => {
    const pointage = pointageMap.get(`${etudiantId}:${emploi.id_edt}`);
    const presence = buildPresencePayload(pointage);

    return {
      ...emploi,
      isPresent: {
        present: presence.present,
        message: presence.present
          ? 'Étudiant présent dans l\'emploi du temps avec des horaires valides'
          : 'Étudiant non présent dans l\'emploi du temps ou horaires de pointage manquants',
      },
      isEntranceOnly: {
        entranceOnly: presence.entranceOnly,
        message: presence.entranceOnly
          ? 'Étudiant a seulement fait un pointage d\'entrée'
          : 'Étudiant n\'a pas fait uniquement un pointage d\'entrée ou pointage manquant',
      },
    };
  });
}

module.exports = {
  ...crudService,
  listByNiveauAndDateRange,
  listStudentTimetable,
};
