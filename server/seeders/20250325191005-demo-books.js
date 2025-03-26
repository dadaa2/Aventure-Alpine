'use strict';
const { v1: uuidv1 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Paramètres configurables
    const USER_BOOKING_PROBABILITY = 0.7; // 70% de chances qu'un utilisateur fasse une réservation
    const MAX_BOOKINGS_TOTAL = 100; // Nombre maximal de réservations à générer
    
    // Récupérer l'utilisateur "jardin" en premier
    const jardinUser = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE pseudo = 'jardin' OR lastName = 'Jardin' OR firstName = 'Jardin';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const jardinId = jardinUser.length > 0 ? jardinUser[0].id : null;
    
    // Récupérer les IDs des utilisateurs existants (SAUF Jardin)
    const users = await queryInterface.sequelize.query(
      jardinId 
        ? `SELECT id FROM Users WHERE id != '${jardinId}';`
        : 'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (users.length === 0 && !jardinId) {
      console.log('Aucun utilisateur trouvé. Impossible de créer des réservations.');
      return;
    }
    
    // Récupérer les IDs des prestations existantes
    const prestations = await queryInterface.sequelize.query(
      'SELECT id FROM Prestations;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (prestations.length === 0) {
      console.log('Aucune prestation trouvée. Impossible de créer des réservations.');
      return;
    }
    
    // Générer des dates aléatoires entre aujourd'hui et dans 6 mois
    const randomDate = (start, end) => {
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return new Date(date.setHours(0, 0, 0, 0)); // Normalise à minuit pour une date pure
    };
    
    // Formater une date au format YYYY-MM-DD pour DATEONLY
    const formatDateOnly = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    // Date actuelle et date dans 6 mois
    const now = new Date();
    const sixMonthsLater = new Date(now);
    sixMonthsLater.setMonth(now.getMonth() + 6);
    
    const bookingsData = [];
    
    // Pour chaque utilisateur (sauf Jardin)
    for (const user of users) {
      if (bookingsData.length >= MAX_BOOKINGS_TOTAL) break;
      
      let continueBooking = true;
      
      // Continue à générer des réservations pour cet utilisateur jusqu'à ce qu'il ne réserve plus
      while (continueBooking && bookingsData.length < MAX_BOOKINGS_TOTAL) {
        // Vérifie si l'utilisateur fait une réservation
        continueBooking = Math.random() < USER_BOOKING_PROBABILITY;
        
        if (continueBooking) {
          // Détermine la date de début aléatoire
          const startDate = randomDate(now, sixMonthsLater);
          
          // Calcule la date de fin (exactement 1 jour après)
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 1);
          
          // Sélectionne une prestation aléatoire
          const randomPrestation = prestations[Math.floor(Math.random() * prestations.length)];
          
          // Crée une entrée de réservation avec des dates au format DATEONLY
          bookingsData.push({
            id: uuidv1(),
            startPrestation: formatDateOnly(startDate),
            endPrestation: formatDateOnly(endDate),
            numberPerson: Math.floor(Math.random() * 10) + 1, // Entre 1 et 10 participants
            star: Math.random() > 0.3 ? Math.floor(Math.random() * 6) : null, // 70% de chance d'avoir une notation
            commentary: Math.random() > 0.5 ? 
              `Commentaire sur la prestation ${Math.random() > 0.5 ? 'positif' : 'avec quelques suggestions'}` : null,
            userId: user.id, // Utilisation d'un vrai ID d'utilisateur
            prestationId: randomPrestation.id, // Utilisation d'un vrai ID de prestation
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    // Ajouter seulement 2 réservations pour Jardin
    if (jardinId) {
      // Créer une date passée (1 mois avant aujourd'hui)
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 1);
      const pastDateEnd = new Date(pastDate);
      pastDateEnd.setDate(pastDate.getDate() + 1);
      
      // Créer une date pour aujourd'hui
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      // Sélectionner deux prestations différentes au hasard
      const prestation1 = prestations[Math.floor(Math.random() * prestations.length)];
      let prestation2;
      do {
        prestation2 = prestations[Math.floor(Math.random() * prestations.length)];
      } while (prestation2.id === prestation1.id); // S'assurer que les prestations sont différentes
      
      // Réservation passée
      bookingsData.push({
        id: uuidv1(),
        startPrestation: formatDateOnly(pastDate),
        endPrestation: formatDateOnly(pastDateEnd),
        numberPerson: 2,
        star: 5,
        commentary: "Excellente prestation, je recommande vivement !",
        userId: jardinId,
        prestationId: prestation1.id,
        createdAt: pastDate,
        updatedAt: pastDate,
        status: 'completed' // Ajout du statut "terminé"
      });
      
      // Réservation pour aujourd'hui
      bookingsData.push({
        id: uuidv1(),
        startPrestation: formatDateOnly(today),
        endPrestation: formatDateOnly(tomorrow),
        numberPerson: 3,
        star: null,
        commentary: null,
        userId: jardinId,
        prestationId: prestation2.id,
        createdAt: new Date(today.getTime() - 48 * 60 * 60 * 1000), // La méthode correcte pour soustraire 48 heures
        updatedAt: new Date(today.getTime() - 48 * 60 * 60 * 1000),
        status: 'confirmed' // Ajout du statut "confirmé"
      });
      
      console.log('2 réservations spécifiques ajoutées pour l\'utilisateur Jardin.');
    } else {
      console.log('Utilisateur Jardin non trouvé, impossible d\'ajouter des réservations spécifiques.');
    }

    await queryInterface.bulkInsert('Books', bookingsData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  }
};