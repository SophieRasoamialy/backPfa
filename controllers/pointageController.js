const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/http');
const pointageService = require('../services/pointageService');

module.exports = {
  createPointage: asyncHandler(async (req, res) => {
    const pointage = await pointageService.createPointage(req.body);
    sendSuccess(res, pointage, 201);
  }),
  closePointage: asyncHandler(async (req, res) => {
    const pointage = await pointageService.closePointage(req.body);
    sendSuccess(res, pointage);
  }),
};
