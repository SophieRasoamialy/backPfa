const createCrudController = require('./crudController');
const niveauService = require('../services/niveauService');

module.exports = createCrudController(niveauService, {
  idParam: 'niveauId',
});
