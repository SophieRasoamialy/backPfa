function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const payload = {
    error: error.message || 'Erreur interne du serveur',
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json(payload);
}

module.exports = errorHandler;
