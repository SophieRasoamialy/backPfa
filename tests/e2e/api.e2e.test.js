const test = require('node:test');
const assert = require('node:assert/strict');

require('dotenv').config();

const createApp = require('../../app');
const sequelize = require('../../config/sequelize');
const Admin = require('../../models/admin');
const Niveau = require('../../models/niveau');
const Enseignant = require('../../models/enseignant');
const Salle = require('../../models/salle');
const Matiere = require('../../models/matiere');
const Etudiant = require('../../models/etudiant');
const EmploiDuTemps = require('../../models/emploidutemps');
const Pointage = require('../../models/pointage');

const TEST_PREFIX = `E2E_${Date.now()}`;
const TEST_ADMIN_EMAIL = `${TEST_PREFIX.toLowerCase()}@local.test`;
const TEST_ADMIN_PASSWORD = 'admin123';

let server;
let baseUrl;
let fixture = {};

function buildUrl(path) {
  return `${baseUrl}${path}`;
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const bodyText = await response.text();
  let body;

  try {
    body = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    body = bodyText;
  }

  return {
    status: response.status,
    headers: response.headers,
    body,
  };
}

async function createFixtureData() {
  const niveau = await Niveau.create({ niveau: `${TEST_PREFIX}_NIVEAU` });
  const enseignant = await Enseignant.create({
    nom_enseignant: `${TEST_PREFIX}_ENSEIGNANT`,
    prenom_enseignant: 'API',
  });
  const salle = await Salle.create({ num_salle: 9000 + Math.floor(Math.random() * 900) });
  const matiere = await Matiere.create({
    matiere: `${TEST_PREFIX}_MATIERE`,
    id_niveau: niveau.id_niveau,
    id_enseignant: enseignant.id_enseignant,
  });
  const etudiant = await Etudiant.create({
    nom_etudiant: `${TEST_PREFIX}_ETUDIANT`,
    prenom_etudiant: 'TEST',
    photo_etudiant: `images/${TEST_PREFIX}.jpg`,
    id_niveau: niveau.id_niveau,
  });
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const edt = await EmploiDuTemps.create({
    date: yesterday,
    heure: '08:00:00',
    heure_fin: '10:00:00',
    id_niveau: niveau.id_niveau,
    id_matiere: matiere.id_matiere,
    id_salle: salle.num_salle,
  });

  return {
    niveau,
    enseignant,
    salle,
    matiere,
    etudiant,
    edt,
    yesterday,
  };
}

async function cleanupFixtureData() {
  await Pointage.destroy({
    where: {
      [sequelize.Sequelize.Op.or]: [
        { id_etudiant: fixture.etudiant?.id_etudiant || null },
        { id_edt: fixture.edt?.id_edt || null },
      ],
    },
    force: true,
  });

  if (fixture.edt) {
    await EmploiDuTemps.destroy({ where: { id_edt: fixture.edt.id_edt }, force: true });
  }

  if (fixture.etudiant) {
    await Etudiant.destroy({ where: { id_etudiant: fixture.etudiant.id_etudiant }, force: true });
  }

  if (fixture.matiere) {
    await Matiere.destroy({ where: { id_matiere: fixture.matiere.id_matiere }, force: true });
  }

  if (fixture.salle) {
    await Salle.destroy({ where: { num_salle: fixture.salle.num_salle }, force: true });
  }

  if (fixture.enseignant) {
    await Enseignant.destroy({ where: { id_enseignant: fixture.enseignant.id_enseignant }, force: true });
  }

  if (fixture.niveau) {
    await Niveau.destroy({ where: { id_niveau: fixture.niveau.id_niveau }, force: true });
  }

  await Admin.destroy({ where: { email: TEST_ADMIN_EMAIL }, force: true });
}

test.before(async () => {
  await sequelize.authenticate();

  const app = createApp();
  server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;

  await Admin.findOrCreate({
    where: { email: TEST_ADMIN_EMAIL },
    defaults: {
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD,
    },
  });

  fixture = await createFixtureData();
});

test.after(async () => {
  await cleanupFixtureData();

  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }

  await sequelize.close();
});

test('GET /health', async () => {
  const result = await request('/health');
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { status: 'ok' });
});

test('GET /api/docs redirects to swagger UI', async () => {
  const result = await request('/api/docs');
  assert.equal(result.status, 301);
  assert.equal(result.headers.get('location'), '/api/docs/');
});

test('GET /api/niveaux lists levels', async () => {
  const result = await request('/api/niveaux');
  assert.equal(result.status, 200);
  assert.ok(Array.isArray(result.body));
  assert.ok(result.body.some((item) => item.id_niveau === fixture.niveau.id_niveau));
});

test('GET /api/niveaux/:id returns the fixture level', async () => {
  const result = await request(`/api/niveaux/${fixture.niveau.id_niveau}`);
  assert.equal(result.status, 200);
  assert.equal(result.body.id_niveau, fixture.niveau.id_niveau);
});

test('PUT /api/niveaux/:id updates the fixture level', async () => {
  const result = await request(`/api/niveaux/${fixture.niveau.id_niveau}`, {
    method: 'PUT',
    body: JSON.stringify({ niveau: `${TEST_PREFIX}_NIVEAU_UPDATED` }),
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.niveau, `${TEST_PREFIX}_NIVEAU_UPDATED`);
});

test('GET /api/salles lists rooms', async () => {
  const result = await request('/api/salles');
  assert.equal(result.status, 200);
  assert.ok(Array.isArray(result.body));
  assert.ok(result.body.some((item) => Number(item.num_salle) === fixture.salle.num_salle));
});

test('GET /api/salles/:id returns the fixture room', async () => {
  const result = await request(`/api/salles/${fixture.salle.num_salle}`);
  assert.equal(result.status, 200);
  assert.equal(Number(result.body.num_salle), fixture.salle.num_salle);
});

test('PUT /api/salles/:id keeps the room reachable', async () => {
  const result = await request(`/api/salles/${fixture.salle.num_salle}`, {
    method: 'PUT',
    body: JSON.stringify({ num_salle: fixture.salle.num_salle }),
  });

  assert.equal(result.status, 200);
  assert.equal(Number(result.body.num_salle), fixture.salle.num_salle);
});

test('GET /api/enseignants and /list return teachers', async () => {
  const paginated = await request('/api/enseignants?page=1&limit=5');
  assert.equal(paginated.status, 200);
  assert.ok(Array.isArray(paginated.body.items));

  const list = await request('/api/enseignants/list');
  assert.equal(list.status, 200);
  assert.ok(Array.isArray(list.body));
  assert.ok(list.body.some((item) => item.id_enseignant === fixture.enseignant.id_enseignant));
});

test('GET /api/enseignants/:id returns the fixture teacher', async () => {
  const result = await request(`/api/enseignants/${fixture.enseignant.id_enseignant}`);
  assert.equal(result.status, 200);
  assert.equal(result.body.id_enseignant, fixture.enseignant.id_enseignant);
});

test('PUT /api/enseignants/:id updates the fixture teacher', async () => {
  const result = await request(`/api/enseignants/${fixture.enseignant.id_enseignant}`, {
    method: 'PUT',
    body: JSON.stringify({
      nom_enseignant: `${TEST_PREFIX}_ENSEIGNANT_UPDATED`,
      prenom_enseignant: 'API',
    }),
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.nom_enseignant, `${TEST_PREFIX}_ENSEIGNANT_UPDATED`);
});

test('GET /api/matieres and /niveau/:niveau return subjects', async () => {
  const list = await request('/api/matieres');
  assert.equal(list.status, 200);
  assert.ok(Array.isArray(list.body));

  const byNiveau = await request(`/api/matieres/niveau/${fixture.niveau.id_niveau}`);
  assert.equal(byNiveau.status, 200);
  assert.ok(Array.isArray(byNiveau.body));
  assert.ok(byNiveau.body.some((item) => item.id_matiere === fixture.matiere.id_matiere));
});

test('GET /api/matieres/:id returns the fixture subject', async () => {
  const result = await request(`/api/matieres/${fixture.matiere.id_matiere}`);
  assert.equal(result.status, 200);
  assert.equal(result.body.id_matiere, fixture.matiere.id_matiere);
});

test('PUT /api/matieres/:id updates the fixture subject', async () => {
  const result = await request(`/api/matieres/${fixture.matiere.id_matiere}`, {
    method: 'PUT',
    body: JSON.stringify({
      matiere: `${TEST_PREFIX}_MATIERE_UPDATED`,
      id_niveau: fixture.niveau.id_niveau,
      id_enseignant: fixture.enseignant.id_enseignant,
    }),
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.matiere, `${TEST_PREFIX}_MATIERE_UPDATED`);
});

test('GET student listing endpoints return the fixture student', async () => {
  const list = await request('/api/etudiants');
  assert.equal(list.status, 200);
  assert.ok(Array.isArray(list.body));
  assert.ok(list.body.some((item) => item.id_etudiant === fixture.etudiant.id_etudiant));

  const duplicateList = await request('/api/etudiants/etudiants');
  assert.equal(duplicateList.status, 200);
  assert.ok(Array.isArray(duplicateList.body));
});

test('GET /api/etudiants/:id and /check/:id work', async () => {
  const byId = await request(`/api/etudiants/${fixture.etudiant.id_etudiant}`);
  assert.equal(byId.status, 200);
  assert.equal(byId.body.id_etudiant, fixture.etudiant.id_etudiant);

  const exists = await request(`/api/etudiants/check/${fixture.etudiant.id_etudiant}`);
  assert.equal(exists.status, 200);
  assert.equal(exists.body.exists, true);
});

test('GET student photo and statistics endpoints work', async () => {
  const photo = await request(`/api/etudiants/${fixture.etudiant.id_etudiant}/photo`);
  assert.equal(photo.status, 200);
  assert.equal(photo.body.photoPath, `images/${TEST_PREFIX}.jpg`);

  const presenceCount = await request(`/api/etudiants/etudiant/${fixture.etudiant.id_etudiant}/presence-count`);
  assert.equal(presenceCount.status, 200);

  const pastCoursesCount = await request(`/api/etudiants/etudiant/${fixture.etudiant.id_etudiant}/past-courses-count`);
  assert.equal(pastCoursesCount.status, 200);

  const absenceCount = await request(`/api/etudiants/etudiant/${fixture.etudiant.id_etudiant}/absence-count`);
  assert.equal(absenceCount.status, 200);

  const unattended = await request(`/api/etudiants/etudiant/${fixture.etudiant.id_etudiant}/unattended-courses`);
  assert.equal(unattended.status, 200);
  assert.ok(Array.isArray(unattended.body));

  const absences = await request(`/api/etudiants/etudiant/${fixture.etudiant.id_etudiant}/absences`);
  assert.equal(absences.status, 200);
  assert.ok(Array.isArray(absences.body));

  const duplicateAbsences = await request(`/api/etudiants/etudiants/${fixture.etudiant.id_etudiant}`);
  assert.equal(duplicateAbsences.status, 200);
});

test('GET /api/etudiants/niveau/:levelId/etudiants returns attendance status', async () => {
  const result = await request(`/api/etudiants/niveau/${fixture.niveau.id_niveau}/etudiants`);
  assert.equal(result.status, 200);
  assert.ok(Array.isArray(result.body));
  assert.ok(result.body.some((item) => item.id_etudiant === fixture.etudiant.id_etudiant));
});

test('PUT /api/etudiants/:id updates the fixture student', async () => {
  const result = await request(`/api/etudiants/${fixture.etudiant.id_etudiant}`, {
    method: 'PUT',
    body: JSON.stringify({
      nom_etudiant: `${TEST_PREFIX}_ETUDIANT_UPDATED`,
      prenom_etudiant: 'TEST',
      photo_etudiant: `images/${TEST_PREFIX}_updated.jpg`,
      id_niveau: fixture.niveau.id_niveau,
    }),
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.nom_etudiant, `${TEST_PREFIX}_ETUDIANT_UPDATED`);
});

test('GET /api/edt endpoints return the fixture timetable entry', async () => {
  const byId = await request(`/api/edt/id/${fixture.edt.id_edt}`);
  assert.equal(byId.status, 200);
  assert.equal(byId.body.id_edt, fixture.edt.id_edt);

  const byNiveau = await request(`/api/edt/${fixture.niveau.id_niveau}?date1=2020-01-01&date2=2030-01-01`);
  assert.equal(byNiveau.status, 200);
  assert.ok(Array.isArray(byNiveau.body));
  assert.ok(byNiveau.body.some((item) => item.id_edt === fixture.edt.id_edt));

  const etudiantView = await request(`/api/edt/etudiant/${fixture.niveau.id_niveau}?date1=2020-01-01&date2=2030-01-01&id_etudiant=${fixture.etudiant.id_etudiant}`);
  assert.equal(etudiantView.status, 200);
  assert.ok(Array.isArray(etudiantView.body));
});

test('PUT /api/edt/id/:id updates the fixture timetable', async () => {
  const result = await request(`/api/edt/id/${fixture.edt.id_edt}`, {
    method: 'PUT',
    body: JSON.stringify({
      date: fixture.yesterday,
      heure: '08:30:00',
      heure_fin: '10:30:00',
      id_niveau: fixture.niveau.id_niveau,
      id_matiere: fixture.matiere.id_matiere,
      id_salle: fixture.salle.num_salle,
    }),
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.heure, '08:30:00');
});

test('POST and PUT /api/pointages manage attendance entries', async () => {
  const createResult = await request('/api/pointages', {
    method: 'POST',
    body: JSON.stringify({
      id_edt: fixture.edt.id_edt,
      id_etudiant: fixture.etudiant.id_etudiant,
      pointage_entre: `${fixture.yesterday}T08:00:00.000Z`,
    }),
  });

  assert.equal(createResult.status, 201);
  assert.equal(createResult.body.id_edt, fixture.edt.id_edt);

  const closeResult = await request('/api/pointages', {
    method: 'PUT',
    body: JSON.stringify({
      id_edt: fixture.edt.id_edt,
      id_etudiant: fixture.etudiant.id_etudiant,
      pointage_sortie: `${fixture.yesterday}T10:00:00.000Z`,
    }),
  });

  assert.equal(closeResult.status, 200);
  assert.ok(closeResult.body.pointage_sortie);
});

test('Student timetable attendance endpoints reflect the pointage state', async () => {
  const presence = await request(`/api/etudiants/etudiant-present/${fixture.etudiant.id_etudiant}/${fixture.edt.id_edt}`);
  assert.equal(presence.status, 200);
  assert.equal(presence.body.present, true);

  const entranceOnly = await request(`/api/etudiants/etudiant-entrance-only/${fixture.etudiant.id_etudiant}/${fixture.edt.id_edt}`);
  assert.equal(entranceOnly.status, 200);
  assert.equal(entranceOnly.body.entranceOnly, false);
});

test('POST /api/admins/login authenticates the test admin', async () => {
  const result = await request('/api/admins/login', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD,
    }),
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.email, TEST_ADMIN_EMAIL);
});

test('DELETE endpoints remove temporary records in reverse order', async () => {
  const deleteEdt = await request(`/api/edt/id/${fixture.edt.id_edt}`, { method: 'DELETE' });
  assert.equal(deleteEdt.status, 200);

  const deleteEtudiant = await request(`/api/etudiants/${fixture.etudiant.id_etudiant}`, { method: 'DELETE' });
  assert.equal(deleteEtudiant.status, 200);

  const deleteMatiere = await request(`/api/matieres/${fixture.matiere.id_matiere}`, { method: 'DELETE' });
  assert.equal(deleteMatiere.status, 200);

  const deleteSalle = await request(`/api/salles/${fixture.salle.num_salle}`, { method: 'DELETE' });
  assert.equal(deleteSalle.status, 200);

  const deleteEnseignant = await request(`/api/enseignants/${fixture.enseignant.id_enseignant}`, { method: 'DELETE' });
  assert.equal(deleteEnseignant.status, 200);

  const deleteNiveau = await request(`/api/niveaux/${fixture.niveau.id_niveau}`, { method: 'DELETE' });
  assert.equal(deleteNiveau.status, 200);

  fixture = {};
});
