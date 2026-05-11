const AppError = require('../utils/appError');

function notFound(req, res, next) {
  next(new AppError(`Route non trouvée: ${req.method} ${req.originalUrl}`, 404));
}

module.exports = notFound;
