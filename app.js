const express = require('express');
const cors = require('cors');
const { json } = require('express');
const routes = require('./routes');
const sequelize = require('./config/sequelize');


const app = express();
const port = process.env.PORT || 8000;

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

module.exports = corsOptions; 

// Middlewares
app.use(cors(corsOptions));
app.use(json());
// Test de connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données établie avec succès.');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données:', err);
  });

// Routes
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});
