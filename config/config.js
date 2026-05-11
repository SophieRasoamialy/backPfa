require('dotenv').config();

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
}

function buildDialectOptions(useSsl) {
  const dialectOptions = {
    connectTimeout: 60000,
  };

  if (useSsl) {
    dialectOptions.ssl = {
      require: true,
      rejectUnauthorized: false,
    };
  }

  return dialectOptions;
}

function createEnvironmentConfig(environment) {
  const useSsl = parseBoolean(process.env.DB_SSL, environment === 'production');

  return {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: buildDialectOptions(useSsl),
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  };
}

module.exports = {
  development: createEnvironmentConfig('development'),
  test: createEnvironmentConfig('test'),
  production: createEnvironmentConfig('production'),
};
  
