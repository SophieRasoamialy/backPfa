const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/http');
const etudiantService = require('../services/etudiantService');

module.exports = {
  login: asyncHandler(async (req, res) => {
    const result = await etudiantService.login(req.body);
    sendSuccess(res, result);
  }),
  forgotPassword: asyncHandler(async (req, res) => {
    const result = await etudiantService.forgotPassword(req.body);
    sendSuccess(res, result);
  }),
  resetPassword: asyncHandler(async (req, res) => {
    const result = await etudiantService.resetPassword(req.body);
    sendSuccess(res, result);
  }),
};
