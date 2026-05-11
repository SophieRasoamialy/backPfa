const createCrudController = require('./crudController');
const salleService = require('../services/salleService');

module.exports = createCrudController(salleService, {
  idParam: 'salleId',
});
