const { QueryTypes } = require('sequelize');

const Enseignant = require('../models/enseignant');
const sequelize = require('../config/sequelize');
const createCrudService = require('./crudService');

const crudService = createCrudService(Enseignant, {
  idField: 'id_enseignant',
  entityLabel: 'Enseignant',
});

async function listPaginated({ page = 1, limit = 10 }) {
  const safePage = Number.parseInt(page, 10) > 0 ? Number.parseInt(page, 10) : 1;
  const safeLimit = Number.parseInt(limit, 10) > 0 ? Number.parseInt(limit, 10) : 10;
  const offset = (safePage - 1) * safeLimit;

  const [items, countResult] = await Promise.all([
    sequelize.query(
      `
        SELECT e.id_enseignant, e.nom_enseignant, e.prenom_enseignant,
               GROUP_CONCAT(m.matiere ORDER BY m.id_matiere SEPARATOR ', ') AS matieres
        FROM Enseignants e
        LEFT JOIN Matieres m ON e.id_enseignant = m.id_enseignant
        GROUP BY e.id_enseignant, e.nom_enseignant, e.prenom_enseignant
        ORDER BY e.id_enseignant DESC
        LIMIT :limit OFFSET :offset
      `,
      {
        replacements: { limit: safeLimit, offset },
        type: QueryTypes.SELECT,
      }
    ),
    Enseignant.count(),
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems: countResult,
      totalPages: Math.ceil(countResult / safeLimit) || 1,
    },
  };
}

module.exports = {
  ...crudService,
  listPaginated,
};
