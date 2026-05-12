# Facecheck Backend

Backend Node.js / Express de l'application **Facecheck / iPresencia**.

Ce service expose l'API utilisée par le frontend pour :
- l'authentification administrateur et étudiant
- la gestion des étudiants, enseignants, matières et emplois du temps
- le pointage d'entrée et de sortie
- le suivi de présence, d'absences et d'assiduité

## Stack technique

- Node.js
- Express.js
- Sequelize
- MySQL
- Swagger pour la documentation API

## Structure

- `app.js` : point d'entrée du serveur
- `routes/` : routes Express
- `controllers/` : contrôleurs HTTP
- `services/` : logique métier
- `models/` : modèles Sequelize
- `migrations/` : migrations base de données
- `seeders/` : données de test
- `middlewares/` : gestion d'erreurs et middlewares
- `docs/` : configuration Swagger

## Prérequis

- Node.js 18+ recommandé
- MySQL démarré
- une base de données configurée pour le projet

## Installation

```bash
cd Facecheck-backend
npm install
```

## Variables d'environnement

Créer un fichier `.env` dans `Facecheck-backend/`.

Exemple minimal :

```env
PORT=8000
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=facecheck
DB_USER=root
DB_PASSWORD=mot_de_passe
DB_DIALECT=mysql
```

Adapte les valeurs à ta base locale.

## Lancer le serveur

```bash
npm start
```

Le backend démarre par défaut sur :

```text
http://localhost:8000
```

## Endpoints utiles

- Santé du serveur :

```text
GET /health
```

- Documentation Swagger :

```text
GET /api/docs
```

## Migrations

Avant de tester l'application, applique les migrations :

```bash
npx sequelize-cli db:migrate
```

## Seeders

### Seeder administrateur

```bash
npx sequelize-cli db:seed --seed seeders/admin.js
```

Compte créé :

- email : `admin@facecheck.local`
- mot de passe : `Admin1234!`

### Seeder étudiant

Assure-toi d'avoir au moins un niveau en base.

```bash
npx sequelize-cli db:seed --seed seeders/niveau.js
npx sequelize-cli db:seed --seed seeders/student-account.js
```

Compte créé :

- email : `etudiant@facecheck.local`
- mot de passe : `Etudiant1234!`

### Autres seeders disponibles

- `seeders/niveau.js`
- `seeders/enseignant.js`
- `seeders/matiere.js`
- `seeders/salle.js`
- `seeders/etudiant.js`
- `seeders/emploiedutemps.js`
- `seeders/pointage.js`

## Scripts utiles

Vérification syntaxique :

```bash
npm test
```

Tests e2e :

```bash
npm run test:e2e
```

## Fonctionnalités actuellement disponibles

### Authentification

- connexion administrateur par email / mot de passe
- connexion étudiant par email / mot de passe
- mot de passe oublié
- réinitialisation de mot de passe

### Administration

- gestion des emplois du temps
- gestion des étudiants
- gestion des enseignants
- gestion des matières

### Étudiant

- consultation de l'emploi du temps hebdomadaire
- pointage d'entrée et de sortie
- consultation du dashboard de présence
- consultation des cours manqués

## Ordre de démarrage conseillé

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed --seed seeders/niveau.js
npx sequelize-cli db:seed --seed seeders/admin.js
npx sequelize-cli db:seed --seed seeders/student-account.js
npm start
```

## Dépannage rapide

### Erreur `Unknown column ...`

Les modèles ont changé mais la base n'est pas à jour. Rejoue les migrations :

```bash
npx sequelize-cli db:migrate
```

### Erreur CORS

Vérifie que :

- le frontend tourne bien sur `http://localhost:3000`
- `FRONTEND_URL=http://localhost:3000` dans le `.env`

### Port backend différent

Si tu veux lancer le backend sur un autre port :

```bash
PORT=8001 npm start
```
