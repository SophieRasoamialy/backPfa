const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Facecheck Backend API',
      version: '1.0.0',
      description: 'Documentation Swagger des endpoints du backend Facecheck.',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: {},
          },
        },
        Niveau: {
          type: 'object',
          properties: {
            id_niveau: { type: 'integer', example: 1 },
            niveau: { type: 'string', example: 'L1' },
          },
        },
        Salle: {
          type: 'object',
          properties: {
            num_salle: { type: 'integer', example: 101 },
          },
        },
        Enseignant: {
          type: 'object',
          properties: {
            id_enseignant: { type: 'integer', example: 1 },
            nom_enseignant: { type: 'string', example: 'Rakoto' },
            prenom_enseignant: { type: 'string', example: 'Jean' },
          },
        },
        Matiere: {
          type: 'object',
          properties: {
            id_matiere: { type: 'integer', example: 1 },
            matiere: { type: 'string', example: 'Mathématiques' },
            id_niveau: { type: 'integer', example: 1 },
            id_enseignant: { type: 'integer', example: 2 },
          },
        },
        Etudiant: {
          type: 'object',
          properties: {
            id_etudiant: { type: 'integer', example: 1 },
            nom_etudiant: { type: 'string', example: 'Rabe' },
            prenom_etudiant: { type: 'string', example: 'Marie' },
            photo_etudiant: { type: 'string', example: 'images/visaaa.jpg' },
            id_niveau: { type: 'integer', example: 1 },
          },
        },
        EmploiDuTemps: {
          type: 'object',
          properties: {
            id_edt: { type: 'integer', example: 1 },
            date: { type: 'string', format: 'date', example: '2026-05-11' },
            heure: { type: 'string', example: '08:00:00' },
            heure_fin: { type: 'string', example: '10:00:00' },
            id_niveau: { type: 'integer', example: 1 },
            id_matiere: { type: 'integer', example: 2 },
            id_salle: { type: 'integer', example: 101 },
          },
        },
        Pointage: {
          type: 'object',
          properties: {
            id_pointage: { type: 'integer', example: 1 },
            id_edt: { type: 'integer', example: 5 },
            id_etudiant: { type: 'integer', example: 10 },
            pointage_entre: { type: 'string', format: 'date-time' },
            pointage_sortie: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalItems: { type: 'integer', example: 30 },
            totalPages: { type: 'integer', example: 3 },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJSDoc(options);
