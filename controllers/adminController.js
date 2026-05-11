const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/http');
const adminService = require('../services/adminService');

module.exports = {
  login: asyncHandler(async (req, res) => {
    const result = await adminService.login(req.body);
    sendSuccess(res, result);
  }),
};
