const Salle = require('../models/salle');
const createCrudService = require('./crudService');

module.exports = createCrudService(Salle, {
  idField: 'num_salle',
  entityLabel: 'Salle',
});
