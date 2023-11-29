import { findOne } from '../models/Administrateur'; // Importez le modèle "Administrateur"

// Fonction de connexion pour vérifier les informations d'identification de l'administrateur
async function loginAdministrateur(email, password) {
  try {
    const administrateur = await findOne({ where: { email } });

    if (!administrateur) {
      return null; // Aucun administrateur avec cet e-mail n'a été trouvé
    }

    const isPasswordValid = /* Comparez le mot de passe hashé stocké avec celui entré par l'administrateur */;
    if (!isPasswordValid) {
      return null; // Mot de passe incorrect
    }

    return administrateur;
  } catch (error) {
    throw error;
  }
}

// Fonction pour lister les étudiants par niveau avec leur nombre d'absences
async function listerEtudiantsParNiveauAvecAbsences() {
  try {
    const dateActuelle = new Date();

    const etudiants = await Etudiant.findAll({
      attributes: ['etudiant_id', 'etudiant_nom', 'etudiant_prenom'],
      include: [
        {
          model: Pointage,
          required: false,
          include: [
            {
              model: EmploiTemps,
              required: false,
              where: {
                dateFin: {
                  [Op.lt]: dateActuelle,
                },
              },
            },
          ],
        },
      ],
    });

    // Calculer le nombre d'absences pour chaque étudiant
    const etudiantsAvecAbsences = etudiants.map((etudiant) => {
      const absences = etudiant.Pointages.filter((pointage) => pointage.EmploiTemp === null);
      return {
        etudiant_id: etudiant.etudiant_id,
        etudiant_nom: etudiant.etudiant_nom,
        etudiant_prenom: etudiant.etudiant_prenom,
        nombre_absences: absences.length,
      };
    });

    return etudiantsAvecAbsences;
  } catch (error) {
    throw error;
  }
}

export default {
  loginAdministrateur,
};
