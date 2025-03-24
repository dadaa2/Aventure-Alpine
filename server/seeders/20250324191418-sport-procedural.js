'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Générateurs de données aléatoires (inchangés)
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomElement = (array) => array[Math.floor(Math.random() * array.length)];
    const randomPrice = () => parseFloat((Math.random() * 200 + 50).toFixed(2));
    
    // ===== Données pour générer du contenu réaliste (inchangées) =====
    
    // Stations de ski
    const skiStations = ['Chamonix', 'Val d\'Isère', 'Tignes', 'Les Arcs', 'La Plagne', 'Méribel', 'Courchevel', 'Les Deux Alpes', 'Alpe d\'Huez', 'Les Saisies'];
    
    // Conditions de neige
    const snowConditions = [
      'Excellente - Poudreuse fraîche',
      'Très bonne - Neige compacte',
      'Bonne - Neige damée',
      'Moyenne - Quelques plaques de glace',
      'Variable - Damée et poudreuse'
    ];
    
    // Remontées mécaniques
    const skiLifts = [
      'Télécabine et télésiège disponibles',
      'Télésiège uniquement',
      'Télécabine, télésiège et téléski',
      'Accès téléphérique panoramique',
      'Remontées mécaniques rapides'
    ];
    
    // Couleurs de pistes
    const pistColors = ['verte', 'bleue', 'rouge', 'noire'];
    
    // Régions de randonnée
    const hikingRegions = [
      'Massif du Mont Blanc',
      'Chaîne des Aravis',
      'Parc Naturel de la Vanoise',
      'Lac d\'Annecy',
      'Massif des Bauges',
      'Chartreuse',
      'Vercors',
      'Aiguilles Rouges'
    ];
    
    // Distances de randonnée
    const hikingDistances = ['5 km', '8 km', '10 km', '12 km', '15 km', '20 km', '25 km'];
    
    // Périodes praticables
    const hikingSeasons = [
      'Toute l\'année',
      'Printemps et été',
      'Été uniquement (juin à septembre)',
      'Printemps, été et automne',
      'Hors période de neige'
    ];
    
    // Difficultés d'escalade
    const climbingDifficulties = [
      '3 - Débutant',
      '4a - Débutant+',
      '5a - Intermédiaire',
      '5c - Intermédiaire+',
      '6a - Confirmé',
      '6c - Confirmé+',
      '7a - Expert',
      '8a - Elite'
    ];
    
    // Temps d'ascension
    const ascentionTimes = ['1h00', '1h30', '2h00', '2h30', '3h00', '4h00', '5h00', '6h00'];
    
    // Sites d'escalade
    const climbingSites = [
      'Paroi des Fiz',
      'Falaise de Presles',
      'Site du Saussois',
      'Gorges du Verdon',
      'Falaise d\'Orpierre',
      'Calanques de Marseille',
      'Rocher de Fontainebleau',
      'Gorges du Tarn'
    ];
    
    // ===== Création des sports =====
    const sports = [
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
    ];
    
    // Génération des prestations de ski
    const skiPrestations = [];
    const skiDetails = [];
    
    for (let i = 1; i <= 10; i++) {
      const station = randomElement(skiStations);
      
      // Prestation ski
      skiPrestations.push({
        id: i,
        name: `Journée ski à ${station}`,
        price: randomPrice(),
        description: `Profitez d'une journée de ski complète à ${station} avec un guide expérimenté. ${
          Math.random() > 0.5 ? 'Forfait et matériel inclus.' : 'Forfait inclus, matériel en option.'
        }`,
        sportId: 1, // ID du sport Ski
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Détails du ski
      skiDetails.push({
        id: i,
        snowCondition: randomElement(snowConditions),
        skiLift: randomElement(skiLifts),
        pistColor: randomElement(pistColors),
        prestationId: i, // Clé étrangère vers la prestation
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Génération des prestations de randonnée
    const hikeStartId = skiPrestations.length + 1;
    const hikePrestations = [];
    const hikeDetails = [];
    
    for (let i = 0; i < 10; i++) {
      const id = hikeStartId + i;
      const region = randomElement(hikingRegions);
      const distance = randomElement(hikingDistances);
      
      // Lieux de départ/arrivée basés sur la région
      let startPoint, endPoint;
      
      if (region.includes('Mont Blanc')) {
        startPoint = randomElement(['Chamonix', 'Les Houches', 'Saint-Gervais']);
        endPoint = randomElement(['Refuge du Goûter', 'Nid d\'Aigle', 'Aiguille du Midi']);
      } else if (region.includes('Annecy')) {
        startPoint = randomElement(['Annecy-le-Vieux', 'Talloires', 'Menthon-Saint-Bernard']);
        endPoint = randomElement(['Duingt', 'Col de la Forclaz', 'Montagne de Semnoz']);
      } else {
        startPoint = `Village de ${randomElement(['Saint-Pierre', 'Haute-Vue', 'Mont-Joie', 'Bellevue'])}`;
        endPoint = `Sommet de ${randomElement(['la Pointe', 'l\'Aiguille', 'la Montagne', 'la Crête'])}`;
      }
      
      // Prestation randonnée
      hikePrestations.push({
        id,
        name: `Randonnée ${region} - ${distance}`,
        price: randomPrice(),
        description: `Découvrez les paysages exceptionnels de ${region} lors d'une randonnée guidée de ${distance}. ${
          Math.random() > 0.5 ? 'Adaptée à tous niveaux.' : 'Pour randonneurs expérimentés.'
        }`,
        sportId: 2, // ID du sport Randonnée
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Détails de la randonnée
      hikeDetails.push({
        id: i + 1,
        regionName: region,
        startPoint,
        endPoint,
        distance,
        praticable: randomElement(hikingSeasons),
        prestationId: id, // Clé étrangère vers la prestation
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Génération des prestations d'escalade 
    const climbStartId = hikeStartId + hikePrestations.length;
    const climbPrestations = [];
    const climbDetails = [];
    
    for (let i = 0; i < 8; i++) {
      const id = climbStartId + i;
      const site = randomElement(climbingSites);
      const difficulty = randomElement(climbingDifficulties);
      
      // Prestation escalade
      climbPrestations.push({
        id,
        name: `Escalade à ${site}`,
        price: randomPrice(),
        description: `Séance d'escalade ${difficulty.includes('Débutant') ? 'pour débutants' : 'tous niveaux'} à ${site}. ${
          Math.random() > 0.5 ? 'Équipement inclus.' : 'Possibilité de louer l\'équipement sur place.'
        }`,
        sportId: 3, // ID du sport Escalade
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Détails de l'escalade
      climbDetails.push({
        id: i + 1,
        difficulty,
        ascentionTime: randomElement(ascentionTimes),
        location: site,
        prestationId: id, // Clé étrangère vers la prestation
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Fusion de toutes les prestations
    const allPrestations = [...skiPrestations, ...hikePrestations, ...climbPrestations];
    
    // Insertion des données générées (noms de tables au singulier)
    try {
      console.log('Insertion des sports...');
      await queryInterface.bulkInsert('Sports', sports, {});
      
      console.log('Insertion des prestations...');
      await queryInterface.bulkInsert('Prestations', allPrestations, {});
      
      console.log('Insertion des détails ski...');
      await queryInterface.bulkInsert('Skis', skiDetails, {});
      
      console.log('Insertion des détails randonnée...');
      await queryInterface.bulkInsert('Randonnes', hikeDetails, {});
      
      console.log('Insertion des détails escalade...');
      await queryInterface.bulkInsert('Escalades', climbDetails, {});
      
      console.log(`Seed terminé : ${allPrestations.length} prestations créées`);
      console.log(`  - ${skiPrestations.length} prestations de ski`);
      console.log(`  - ${hikePrestations.length} prestations de randonnée`);
      console.log(`  - ${climbPrestations.length} prestations d'escalade`);
    } catch (error) {
      console.error('ERREUR PENDANT LE SEEDING:', error);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Supprimer toutes les données dans l'ordre inverse
    await queryInterface.bulkDelete('Escalade', null, {});
    await queryInterface.bulkDelete('Randonne', null, {});
    await queryInterface.bulkDelete('Ski', null, {});
    await queryInterface.bulkDelete('Prestation', null, {});
    await queryInterface.bulkDelete('Sport', null, {});
    
    console.log('Toutes les données ont été supprimées');
  }
};
