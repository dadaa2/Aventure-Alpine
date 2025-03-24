'use strict';

// Seed pour l'insertion des sports et des prestations

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Insérer les sports
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

    const prestations = [];
    
    // Prestations de ski
    prestations.push({
      name: 'Cours de ski débutant',
      price: 45.00,
      description: 'Cours de ski pour débutants avec un moniteur expérimenté. Durée 2h.',
      sportId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    prestations.push({
      name: 'Cours de ski confirmé',
      price: 65.00,
      description: 'Perfectionnement technique pour skieurs intermédiaires et avancés. Durée 3h.',
      sportId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    prestations.push({
      name: 'Journée hors-piste',
      price: 120.00,
      description: 'Excursion d\'une journée en hors-piste avec guide de montagne certifié.',
      sportId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Prestations de randonnée
    prestations.push({
      name: 'Randonnée découverte',
      price: 30.00,
      description: 'Randonnée facile d\'une demi-journée pour découvrir les paysages alpins.',
      sportId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    prestations.push({
      name: 'Randonnée journée',
      price: 55.00,
      description: 'Randonnée complète avec guide, repas inclus. Niveau intermédiaire.',
      sportId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    prestations.push({
      name: 'Trek de 3 jours',
      price: 250.00,
      description: 'Trek avec nuits en refuge, repas et guide inclus. Pour randonneurs confirmés.',
      sportId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Prestations d'escalade
    prestations.push({
      name: 'Initiation escalade',
      price: 40.00,
      description: 'Initiation à l\'escalade sur mur artificiel. Équipement fourni.',
      sportId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    prestations.push({
      name: 'Journée escalade en falaise',
      price: 85.00,
      description: 'Journée d\'escalade en milieu naturel avec guide. Niveau intermédiaire.',
      sportId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    prestations.push({
      name: 'Stage escalade 2 jours',
      price: 180.00,
      description: 'Stage intensif d\'escalade sur 2 jours, matériel et hébergement inclus.',
      sportId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await queryInterface.bulkInsert('Prestations', prestations, {});
    
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Prestations', null, {});
    await queryInterface.bulkDelete('Sports', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
