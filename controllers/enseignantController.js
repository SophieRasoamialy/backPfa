const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/http');
const createCrudController = require('./crudController');
const enseignantService = require('../services/enseignantService');

const crudController = createCrudController(enseignantService, {
  idParam: 'enseignantId',
});

module.exports = {
  ...crudController,
  getAllEnseignants: crudController.list,
  getEnseignantsPagine: asyncHandler(async (req, res) => {
    const result = await enseignantService.listPaginated(req.query);
    sendSuccess(res, result);
  }),
};
