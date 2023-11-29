const express = require('express');
const cors = require('cors'); // Import du module CORS
const { json } = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Utilisation du middleware CORS
app.use(json());

const niveauRoutes = require('./routes/niveauRoutes'); 
app.use('/api/niveaux', niveauRoutes);

const matiereRoutes = require('./routes/matiereRoutes');
app.use('/api/matieres', matiereRoutes);

const enseignantRoutes = require('./routes/enseignantRoutes');
app.use('/api/enseignants', enseignantRoutes);

const etudiantRoutes = require('./routes/etudiantRoutes');
app.use('/api/etudiants', etudiantRoutes);

const edtRoutes = require('./routes/emploieTempsRoutes');
app.use('/api/edt', edtRoutes);

const salleRoutes = require('./routes/salleRoutes');
app.use('/api/salles', salleRoutes);


app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});
