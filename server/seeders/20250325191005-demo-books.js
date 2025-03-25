'use strict';
const { v1: uuidv1 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Paramètres configurables
    const USER_BOOKING_PROBABILITY = 0.7; // 70% de chances qu'un utilisateur fasse une réservation
    const MAX_BOOKINGS_TOTAL = 100; // Nombre maximal de réservations à générer
    
    // Récupérer les IDs des utilisateurs existants
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (users.length === 0) {
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
    
    // Pour chaque utilisateur
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
            numberPerson: Math.floor(Math.random() * 5) + 1, // Entre 1 et 5 participants
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

    await queryInterface.bulkInsert('Books', bookingsData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  }
};