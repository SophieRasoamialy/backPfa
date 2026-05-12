const Admin = require('../models/admin');
const AppError = require('../utils/appError');
const {
  createResetToken,
  hashPassword,
  hashResetToken,
  verifyPassword,
} = require('../utils/password');

async function login({ email, password }) {
  if (!email || !password) {
    throw new AppError('Email et mot de passe requis', 400);
  }

  const admin = await Admin.findOne({ where: { email } });

  if (!admin) {
    throw new AppError('Identifiants invalides', 401);
  }

  const passwordMatches = await verifyPassword(password, admin.password);

  if (!passwordMatches) {
    throw new AppError('Identifiants invalides', 401);
  }

  if (!admin.password.includes(':')) {
    admin.password = await hashPassword(password);
    await admin.save();
  }

  return {
    id: admin.id,
    email: admin.email,
    role: 'admin',
  };
}

async function forgotPassword({ email }) {
  if (!email) {
    throw new AppError('Email requis', 400);
  }

  const admin = await Admin.findOne({ where: { email } });

  if (!admin) {
    return {
      message: 'Si ce compte existe, un lien de reinitialisation a ete genere.',
    };
  }

  const resetToken = createResetToken();
  admin.reset_password_token = hashResetToken(resetToken);
  admin.reset_password_expires_at = new Date(Date.now() + 60 * 60 * 1000);
  await admin.save();

  return {
    message: 'Token de reinitialisation genere.',
    resetToken,
    expiresAt: admin.reset_password_expires_at,
  };
}

async function resetPassword({ token, password, confirmPassword }) {
  if (!token || !password || !confirmPassword) {
    throw new AppError('Token, mot de passe et confirmation requis', 400);
  }

  if (password !== confirmPassword) {
    throw new AppError('Les mots de passe ne correspondent pas', 400);
  }

  const admin = await Admin.findOne({
    where: {
      reset_password_token: hashResetToken(token),
    },
  });

  if (
    !admin ||
    !admin.reset_password_expires_at ||
    admin.reset_password_expires_at.getTime() < Date.now()
  ) {
    throw new AppError('Token de reinitialisation invalide ou expire', 400);
  }

  admin.password = await hashPassword(password);
  admin.reset_password_token = null;
  admin.reset_password_expires_at = null;
  await admin.save();

  return {
    message: 'Mot de passe reinitialise avec succes.',
  };
}

module.exports = {
  login,
  forgotPassword,
  resetPassword,
};
