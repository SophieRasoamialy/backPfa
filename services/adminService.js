const Admin = require('../models/admin');
const AppError = require('../utils/appError');

async function login({ email, password }) {
  if (!email || !password) {
    throw new AppError('Email et mot de passe requis', 400);
  }

  const admin = await Admin.findOne({ where: { email } });

  if (!admin || admin.password !== password) {
    throw new AppError('Identifiants invalides', 401);
  }

  return {
    id: admin.id,
    email: admin.email,
  };
}

module.exports = {
  login,
};
