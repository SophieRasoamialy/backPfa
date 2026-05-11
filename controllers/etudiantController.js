const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/http');
const createCrudController = require('./crudController');
const etudiantService = require('../services/etudiantService');

const crudController = createCrudController(etudiantService, {
  idParam: 'etudiantId',
});

module.exports = {
  ...crudController,
  getAllEtudiants: crudController.list,
  checkIfEtudiantExists: asyncHandler(async (req, res) => {
    const result = await etudiantService.exists(req.params.etudiantId);
    sendSuccess(res, result);
  }),
  getAbsentStudentTimetable: asyncHandler(async (req, res) => {
    const absences = await etudiantService.listAbsences(req.params.etudiantId);
    sendSuccess(res, absences);
  }),
  getStudentsWithAbsenceCountByLevelHandler: asyncHandler(async (req, res) => {
    const result = await etudiantService.listAttendanceStatusByLevel(req.params.levelId);
    sendSuccess(res, result);
  }),
  getAbsenceCountForStudent: asyncHandler(async (req, res) => {
    const result = await etudiantService.getAbsenceCount(req.params.etudiantId);
    sendSuccess(res, result);
  }),
  getPresenceCountForStudent: asyncHandler(async (req, res) => {
    const result = await etudiantService.getPresenceCount(req.params.etudiantId);
    sendSuccess(res, result);
  }),
  getPastCoursesCountForStudent: asyncHandler(async (req, res) => {
    const result = await etudiantService.getPastCoursesCount(req.params.etudiantId);
    sendSuccess(res, result);
  }),
  getUnattendedCoursesForStudent: asyncHandler(async (req, res) => {
    const result = await etudiantService.listUnattendedCourses(req.params.etudiantId);
    sendSuccess(res, result);
  }),
  checkIfEtudiantPresentInEdt: asyncHandler(async (req, res) => {
    const result = await etudiantService.getPresenceByCourse(req.params.id_etudiant, req.params.id_edt);
    sendSuccess(res, result);
  }),
  checkIfEtudiantEntranceOnly: asyncHandler(async (req, res) => {
    const result = await etudiantService.getEntranceOnlyByCourse(req.params.id_etudiant, req.params.id_edt);
    sendSuccess(res, result);
  }),
  getPhotoEtudiantById: asyncHandler(async (req, res) => {
    const result = await etudiantService.getPhoto(req.params.etudiantId);
    sendSuccess(res, result);
  }),
};
