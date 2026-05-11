const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/http');
const createCrudController = require('./crudController');
const emploiTempsService = require('../services/emploiTempsService');

const crudController = createCrudController(emploiTempsService, {
  idParam: 'edtId',
});

module.exports = {
  ...crudController,
  getAllEmploiTemps: asyncHandler(async (req, res) => {
    const emploisTemps = await emploiTempsService.listByNiveauAndDateRange(
      req.params.niveau,
      req.query.date1,
      req.query.date2
    );

    sendSuccess(res, emploisTemps);
  }),
  getAllEmploiTempsEtudiant: asyncHandler(async (req, res) => {
    const emploisTemps = await emploiTempsService.listStudentTimetable(
      req.params.niveau,
      req.query.date1,
      req.query.date2,
      req.query.id_etudiant
    );

    sendSuccess(res, emploisTemps);
  }),
};
