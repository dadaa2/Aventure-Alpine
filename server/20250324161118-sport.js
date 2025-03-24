'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Création des sports
      await queryInterface.bulkInsert('Sports', [
        {
          id: 1,
          name: 'Ski',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'Randonnée',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          name: 'Escalade',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});

      console.log("Sports created successfully");

      // Création des prestations
      await queryInterface.bulkInsert('Prestations', [
        {
          id: 1,
          name: 'Journée ski à Chamonix',
          price: 120.00,
          description: 'Une journée de ski dans la magnifique station de Chamonix. Forfait et matériel inclus.',
          sportId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'Randonnée au Mont Blanc',
          price: 80.00,
          description: 'Partez à la découverte du Mont Blanc lors d\'une randonnée guidée. Équipement non inclus.',
          sportId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          name: 'Escalade à Annecy',
          price: 95.00,
          description: 'Séance d\'escalade pour tous niveaux dans les falaises d\'Annecy. Équipement inclus.',
          sportId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          name: 'Ski de fond aux Saisies',
          price: 75.00,
          description: 'Parcours de ski de fond dans un cadre naturel préservé. Idéal pour les amateurs de glisse douce.',
          sportId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          name: 'Randonnée lac d\'Annecy',
          price: 50.00,
          description: 'Balade autour du lac d\'Annecy avec vue panoramique sur les montagnes environnantes.',
          sportId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});

      console.log("Prestations created successfully");

      // Création des données spécifiques au ski
      await queryInterface.bulkInsert('Skis', [
        {
          id: 1,
          snowCondition: 'Excellente - Poudreuse',
          skiLift: 'Télécabine et télésiège disponibles',
          pistColor: 'rouge',
          sportId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          snowCondition: 'Bonne - Neige damée',
          skiLift: 'Télésiège uniquement',
          pistColor: 'bleue',
          sportId: 1, 
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});

      console.log("Ski details created successfully");

      // Création des données spécifiques à la randonnée
      await queryInterface.bulkInsert('Randonnees', [
        {
          id: 1,
          regionName: 'Massif du Mont Blanc',
          startPoint: 'Chamonix',
          endPoint: 'Refuge du Goûter',
          distance: '12 km',
          praticable: 'Été uniquement (juin à septembre)',
          sportId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          regionName: 'Lac d\'Annecy',
          startPoint: 'Annecy-le-Vieux',
          endPoint: 'Talloires',
          distance: '8 km',
          praticable: 'Toute l\'année',
          sportId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});

      console.log("Randonnee details created successfully");

      // Création des données spécifiques à l'escalade
      await queryInterface.bulkInsert('Escalades', [
        {
          id: 1,
          difficulty: '6a - Confirmé',
          ascentionTime: '2h30',
          location: 'Paroi des Fiz',
          sportId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});

      console.log("Escalade details created successfully");

      return Promise.resolve();
    } catch (error) {
      console.error("Error in seeder:", error.message);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Suppression des données dans l'ordre inverse pour respecter les contraintes d'intégrité
    await queryInterface.bulkDelete('Escalades', null, {});
    await queryInterface.bulkDelete('Randonnees', null, {});
    await queryInterface.bulkDelete('Skis', null, {});
    await queryInterface.bulkDelete('Prestations', null, {});
    await queryInterface.bulkDelete('Sports', null, {});
  }
};
