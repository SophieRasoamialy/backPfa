const crypto = require('crypto');

const HASH_SEPARATOR = ':';

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');

    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(`${salt}${HASH_SEPARATOR}${derivedKey.toString('hex')}`);
    });
  });
}

function verifyPassword(password, storedPassword) {
  return new Promise((resolve, reject) => {
    if (!storedPassword || !storedPassword.includes(HASH_SEPARATOR)) {
      resolve(password === storedPassword);
      return;
    }

    const [salt, storedHash] = storedPassword.split(HASH_SEPARATOR);

    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      const derivedHashBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
      const storedHashBuffer = Buffer.from(storedHash, 'hex');

      if (derivedHashBuffer.length !== storedHashBuffer.length) {
        resolve(false);
        return;
      }

      resolve(crypto.timingSafeEqual(derivedHashBuffer, storedHashBuffer));
    });
  });
}

function createResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  hashPassword,
  verifyPassword,
  createResetToken,
  hashResetToken,
};
