const { Op, QueryTypes } = require('sequelize');

const Etudiant = require('../models/etudiant');
const EmploiDuTemps = require('../models/emploidutemps');
const Pointage = require('../models/pointage');
const sequelize = require('../config/sequelize');
const AppError = require('../utils/appError');
const createCrudService = require('./crudService');

const crudService = createCrudService(Etudiant, {
  idField: 'id_etudiant',
  entityLabel: 'Étudiant',
});

async function getStudentLevelId(etudiantId) {
  const etudiant = await Etudiant.findByPk(etudiantId, {
    attributes: ['id_etudiant', 'id_niveau'],
  });

  if (!etudiant) {
    throw new AppError('Étudiant non trouvé', 404);
  }

  return etudiant.id_niveau;
}

function buildPresenceResponse(pointage) {
  return {
    present: Boolean(pointage && pointage.pointage_entre && pointage.pointage_sortie),
    entranceOnly: Boolean(pointage && pointage.pointage_entre && !pointage.pointage_sortie),
  };
}

async function exists(etudiantId) {
  const etudiant = await Etudiant.findByPk(etudiantId, {
    attributes: ['id_etudiant'],
  });

  return {
    exists: Boolean(etudiant),
    message: etudiant ? 'Étudiant trouvé' : 'Étudiant non trouvé',
  };
}

async function listAbsences(etudiantId) {
  const niveauId = await getStudentLevelId(etudiantId);

  const query = `
    SELECT edt.id_edt, edt.date, edt.heure, edt.heure_fin, mat.id_matiere, mat.matiere
    FROM EmploiDuTemps edt
    INNER JOIN Matieres mat ON edt.id_matiere = mat.id_matiere
    LEFT JOIN Pointages p ON edt.id_edt = p.id_edt AND p.id_etudiant = :etudiantId
    WHERE edt.id_niveau = :niveauId
      AND p.id_pointage IS NULL
    ORDER BY edt.date DESC, edt.heure DESC
  `;

  return sequelize.query(query, {
    replacements: { etudiantId, niveauId },
    type: QueryTypes.SELECT,
  });
}

async function listAttendanceStatusByLevel(levelId) {
  const [students, timetable, pointages] = await Promise.all([
    Etudiant.findAll({
      where: { id_niveau: levelId },
      order: [['id_etudiant', 'DESC']],
    }),
    EmploiDuTemps.findAll({
      where: { id_niveau: levelId },
      attributes: ['id_edt'],
    }),
    Pointage.findAll({
      attributes: ['id_etudiant', 'id_edt', 'pointage_entre', 'pointage_sortie'],
    }),
  ]);

  const timetableIds = new Set(timetable.map((course) => course.id_edt));
  const pointageMap = new Map();

  for (const pointage of pointages) {
    if (timetableIds.has(pointage.id_edt)) {
      pointageMap.set(`${pointage.id_etudiant}:${pointage.id_edt}`, pointage);
    }
  }

  return students.map((student) => {
    let nombre_absences = 0;
    let status = 'Pas en classe';

    for (const course of timetable) {
      const pointage = pointageMap.get(`${student.id_etudiant}:${course.id_edt}`);

      if (!pointage || !pointage.pointage_entre) {
        nombre_absences += 1;
        continue;
      }

      if (!pointage.pointage_sortie) {
        status = 'En classe';
      }
    }

    return {
      id_etudiant: student.id_etudiant,
      nom_etudiant: student.nom_etudiant,
      prenom_etudiant: student.prenom_etudiant,
      photo_etudiant: student.photo_etudiant,
      nombre_absences,
      status,
    };
  });
}

async function getPresenceCount(etudiantId) {
  await getStudentLevelId(etudiantId);

  return Pointage.count({
    where: {
      id_etudiant: etudiantId,
    },
  });
}

async function getPastCoursesCount(etudiantId) {
  const niveauId = await getStudentLevelId(etudiantId);

  return EmploiDuTemps.count({
    where: {
      id_niveau: niveauId,
      date: {
        [Op.lt]: new Date(),
      },
    },
  });
}

async function getAbsenceCount(etudiantId) {
  const [presenceCount, pastCoursesCount] = await Promise.all([
    getPresenceCount(etudiantId),
    getPastCoursesCount(etudiantId),
  ]);

  return Math.max(pastCoursesCount - presenceCount, 0);
}

async function listUnattendedCourses(etudiantId) {
  const niveauId = await getStudentLevelId(etudiantId);

  return sequelize.query(
    `
      SELECT edt.id_edt, edt.date, edt.heure, edt.heure_fin, edt.id_niveau,
             edt.id_matiere, edt.id_salle, m.matiere, e.nom_enseignant, e.prenom_enseignant
      FROM EmploiDuTemps edt
      LEFT JOIN Pointages p ON edt.id_edt = p.id_edt AND p.id_etudiant = :etudiantId
      LEFT JOIN Matieres m ON edt.id_matiere = m.id_matiere
      LEFT JOIN Enseignants e ON m.id_enseignant = e.id_enseignant
      WHERE edt.id_niveau = :niveauId
        AND edt.date < NOW()
        AND p.id_edt IS NULL
      ORDER BY edt.date DESC, edt.heure DESC
    `,
    {
      replacements: { etudiantId, niveauId },
      type: QueryTypes.SELECT,
    }
  );
}

async function getAttendanceState(etudiantId, edtId) {
  const pointage = await Pointage.findOne({
    where: { id_etudiant: etudiantId, id_edt: edtId },
  });

  return buildPresenceResponse(pointage);
}

async function getPresenceByCourse(etudiantId, edtId) {
  const state = await getAttendanceState(etudiantId, edtId);

  return {
    present: state.present,
    message: state.present
      ? 'Étudiant présent dans l\'emploi du temps avec des horaires valides'
      : 'Étudiant non présent dans l\'emploi du temps ou horaires de pointage manquants',
  };
}

async function getEntranceOnlyByCourse(etudiantId, edtId) {
  const state = await getAttendanceState(etudiantId, edtId);

  return {
    entranceOnly: state.entranceOnly,
    message: state.entranceOnly
      ? 'Étudiant a seulement fait un pointage d\'entrée'
      : 'Étudiant n\'a pas fait uniquement un pointage d\'entrée ou pointage manquant',
  };
}

async function getPhoto(etudiantId) {
  const etudiant = await crudService.getById(etudiantId);

  if (!etudiant.photo_etudiant) {
    throw new AppError('Aucun chemin de photo trouvé pour cet étudiant.', 404);
  }

  return { photoPath: etudiant.photo_etudiant };
}

module.exports = {
  ...crudService,
  getStudentLevelId,
  exists,
  listAbsences,
  listAttendanceStatusByLevel,
  getPresenceCount,
  getPastCoursesCount,
  getAbsenceCount,
  listUnattendedCourses,
  getPresenceByCourse,
  getEntranceOnlyByCourse,
  getPhoto,
};
