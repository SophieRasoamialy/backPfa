const Niveau = require('../models/niveau');
const createCrudService = require('./crudService');

module.exports = createCrudService(Niveau, {
  idField: 'id_niveau',
  entityLabel: 'Niveau',
});
