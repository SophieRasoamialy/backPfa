const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/http');
const createCrudController = require('./crudController');
const matiereService = require('../services/matiereService');

const crudController = createCrudController(matiereService, {
  idParam: 'matiereId',
});

module.exports = {
  ...crudController,
  getMatieresByNiveau: asyncHandler(async (req, res) => {
    const matieres = await matiereService.listByNiveau(req.params.niveau);
    sendSuccess(res, matieres);
  }),
};
