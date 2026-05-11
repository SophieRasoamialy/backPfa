const { QueryTypes } = require('sequelize');

const Matiere = require('../models/matiere');
const sequelize = require('../config/sequelize');
const createCrudService = require('./crudService');

const crudService = createCrudService(Matiere, {
  idField: 'id_matiere',
  entityLabel: 'Matière',
});

async function listByNiveau(niveauId) {
  const query = `
    SELECT m.id_matiere, m.matiere, m.id_enseignant,
           e.nom_enseignant, e.prenom_enseignant
    FROM Matieres m
    INNER JOIN Enseignants e ON m.id_enseignant = e.id_enseignant
    WHERE m.id_niveau = :niveauId
    ORDER BY m.id_matiere DESC
  `;

  return sequelize.query(query, {
    replacements: { niveauId },
    type: QueryTypes.SELECT,
  });
}

module.exports = {
  ...crudService,
  listByNiveau,
};
