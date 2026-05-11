const express = require('express');
const cors = require('cors');
const { json } = require('express');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const swaggerSpec = require('./docs/swagger');
const routes = require('./routes');
const sequelize = require('./config/sequelize');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

function createApp() {
  const app = express();

  const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

async function startServer() {
  const port = process.env.PORT || 8000;
  const app = createApp();

  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }

  app.listen(port, () => {
    console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = createApp;
