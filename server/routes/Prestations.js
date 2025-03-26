const express = require('express');
const router = express.Router();
const db = require('../models'); // Importer tous les modèles
const { Op } = require('sequelize');
const { Prestation, Sport } = db; // Déstructurer les modèles dont vous avez besoin

// Route pour récupérer toutes les sports
router.get('/sports/all', async (req, res) => {
  try {
      const sports = await Sport.findAll();
      res.json(sports);
  } catch (error) {
      console.error("Error getting sports:", error);
      res.status(500).json({ error: "An error occurred while getting the sports." });
  }
});

// Route GET avec pagination et filtres
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = '',
      sportId,
      priceMin,
      priceMax
    } = req.query;
    
    console.log('Requête prestations avec paramètres:', {
      page, limit, search, sportId, priceMin, priceMax
    });

    // Construction des conditions WHERE
    const whereConditions = {};
    
    // Filtre par recherche (nom ou description)
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Filtre par sport avec conversion en nombre
    if (sportId) {
      whereConditions.sportId = parseInt(sportId, 10);
    }
    
    // Filtre par prix avec conversion en nombre pour éviter les erreurs de type
    if (priceMin !== undefined && priceMax !== undefined) {
      whereConditions.price = { 
        [Op.between]: [parseFloat(priceMin), parseFloat(priceMax)] 
      };
    } else if (priceMin !== undefined) {
      whereConditions.price = { [Op.gte]: parseFloat(priceMin) };
    } else if (priceMax !== undefined) {
      whereConditions.price = { [Op.lte]: parseFloat(priceMax) };
    }

    // Avant d'exécuter la requête, log
    console.log('Conditions de filtrage:', JSON.stringify(whereConditions));
    
    // Exécuter la requête avec pagination
    const prestations = await Prestation.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      include: [{
        model: Sport,
        as: 'sport',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`Résultat de la requête: ${prestations.count} prestations trouvées`);
    
    // Si aucune prestation trouvée, log plus détaillé
    if (prestations.count === 0) {
      const allPrestations = await Prestation.count();
      console.log(`Total des prestations en base: ${allPrestations}`);
    }
    
    res.json({
      rows: prestations.rows,
      count: prestations.count
    });
  } catch (error) {
    console.error('Error fetching prestations:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors du chargement des prestations' });
  }
});

// Route GET pour récupérer une prestation par ID
router.get('/:id', async (req, res) => {
  try {
    const prestation = await Prestation.findByPk(req.params.id, {
      include: [{ model: Sport, as: 'sport' }]
    });

    if (!prestation) {
      return res.status(404).json({ error: "Prestation not found" });
    }

    // Convertir en objet JS pour pouvoir ajouter des propriétés
    const prestationData = prestation.toJSON();
    
    if (!prestationData.sport) {
      prestationData.sportDetails = null;
      return res.status(200).json(prestationData);
    }
    
    const sportType = prestationData.sport.name.toLowerCase();
    
    // Ajouter des logs pour le débogage
    console.log('Sport type:', sportType);
    
    // Normalisation du nom du sport (suppression des accents)
    const normalizedSportType = sportType
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
      
    console.log('Sport type normalisé:', normalizedSportType);
    
    // Récupération des détails du sport en fonction de son type
    let sportDetails = null;
    if (normalizedSportType === 'ski' && db.Ski) {
      sportDetails = await db.Ski.findOne({ where: { prestationId: prestationData.id } });
    } else if ((normalizedSportType === 'randonnee' || normalizedSportType === 'randonne') && db.Randonne) {
      sportDetails = await db.Randonne.findOne({ where: { prestationId: prestationData.id } });
    } else if (normalizedSportType === 'escalade' && db.Escalade) {
      sportDetails = await db.Escalade.findOne({ where: { prestationId: prestationData.id } });
    }
    
    prestationData.sportDetails = sportDetails;
    res.status(200).json(prestationData);
  } catch (error) {
    console.error("Error fetching prestation:", error);
    res.status(500).json({ error: "An error occurred while fetching the prestation." });
  }
});

// Créer une prestation avec les détails du sport
router.post('/', async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
      const { name, price, description, sportId, sportDetails } = req.body;
      
      // Création de la prestation
      const newPrestation = await Prestation.create({
          name,
          price,
          description,
          sportId
      }, { transaction });
      
      // Si des détails spécifiques au sport sont fournis, les enregistrer
      if (sportDetails) {
          // Récupérer le sport pour connaître son type
          const sport = await Sport.findByPk(sportId);
          
          if (!sport) {
              await transaction.rollback();
              return res.status(404).json({ error: "Sport not found" });
          }
          
          const sportType = sport.name.toLowerCase();
          
          // Créer les détails spécifiques au sport
          if (sportType === 'ski') {
              await db.Ski.create({
                  ...sportDetails,
                  prestationId: newPrestation.id // Correction: utiliser prestationId au lieu de sportId
              }, { transaction });
          } else if (sportType === 'randonnée') {
              await db.Randonne.create({ // Correction: Randonne au lieu de Randonnee
                  ...sportDetails,
                  prestationId: newPrestation.id // Correction: utiliser prestationId au lieu de sportId
              }, { transaction });
          } else if (sportType === 'escalade') {
              await db.Escalade.create({
                  ...sportDetails,
                  prestationId: newPrestation.id // Correction: utiliser prestationId au lieu de sportId
              }, { transaction });
          }
      }
      
      await transaction.commit();
      
      // Retourner la prestation avec ses détails
      const completePrestation = await Prestation.findByPk(newPrestation.id, {
          include: [{ model: Sport, as: 'sport' }]
      });
      
      res.status(201).json(completePrestation);
  } catch (error) {
      await transaction.rollback();
      console.error("Error creating prestation:", error);
      res.status(500).json({ error: "An error occurred while creating the prestation." });
  }
});

// Mise à jour de la route PUT pour modifier une prestation
router.put('/:id', async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { name, price, description, sportId, sportDetails: sportDetailsFromBody } = req.body;
    
    // Vérifier si la prestation existe
    const prestation = await Prestation.findByPk(id);
    if (!prestation) {
      await transaction.rollback();
      return res.status(404).json({ error: "Prestation not found" });
    }
    
    // Mettre à jour la prestation
    await prestation.update({
      name,
      price,
      description,
      sportId
    }, { transaction });
    
    // Si des détails spécifiques au sport sont fournis, les mettre à jour
    if (sportDetailsFromBody) {
      // Récupérer le sport pour connaître son type
      const sport = await Sport.findByPk(sportId);
      if (!sport) {
        await transaction.rollback();
        return res.status(404).json({ error: "Sport not found" });
      }
      
      const sportType = sport.name.toLowerCase();
      
      // Mettre à jour ou créer les détails spécifiques au sport
      if (sportType === 'ski') {
        const [skiDetails] = await db.Ski.findOrCreate({
          where: { prestationId: id }, // Utiliser prestationId au lieu de sportId
          defaults: { ...sportDetailsFromBody, prestationId: id }
        });
        
        if (skiDetails) {
          await skiDetails.update({
            ...sportDetailsFromBody,
            prestationId: id
          }, { transaction });
        }
      } else if (sportType === 'randonnée') {
        const [randonneeDetails] = await db.Randonne.findOrCreate({
          where: { prestationId: id }, // Utiliser prestationId au lieu de sportId
          defaults: { ...sportDetailsFromBody, prestationId: id }
        });
        
        if (randonneeDetails) {
          await randonneeDetails.update({
            ...sportDetailsFromBody,
            prestationId: id
          }, { transaction });
        }
      } else if (sportType === 'escalade') {
        const [escaladeDetails] = await db.Escalade.findOrCreate({
          where: { prestationId: id }, // Utiliser prestationId au lieu de sportId
          defaults: { ...sportDetailsFromBody, prestationId: id }
        });
        
        if (escaladeDetails) {
          await escaladeDetails.update({
            ...sportDetailsFromBody,
            prestationId: id
          }, { transaction });
        }
      }
    }
    
    await transaction.commit();
    
    // Récupérer la prestation mise à jour avec les détails du sport
    const updatedPrestation = await Prestation.findByPk(id, {
      include: [{ model: Sport, as: 'sport' }]  // Attention à l'alias 'as'
    });
    
    // Récupérer les détails du sport associé
    const sportType = updatedPrestation.sport ? updatedPrestation.sport.name.toLowerCase() : null;
    let sportDetails = null;

    if (sportType === 'ski') {
      sportDetails = await db.Ski.findOne({ where: { prestationId: id } });
    } else if (sportType === 'randonnée' && db.Randonne) {
      sportDetails = await db.Randonne.findOne({ where: { prestationId: id } });
    } else if (sportType === 'escalade' && db.Escalade) {
      sportDetails = await db.Escalade.findOne({ where: { prestationId: id } });
    }

    const result = updatedPrestation.toJSON();
    result.sportDetails = sportDetails;
    
    res.status(200).json(result);
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating prestation:", error);
    res.status(500).json({ error: "An error occurred while updating the prestation." });
  }
});

// Supprimer une prestation
router.delete('/:id', async (req, res) => {
    try {
        const prestation = await Prestation.findByPk(req.params.id);
        if (!prestation) {
            return res.status(404).json({ error: "Prestation not found" });
        }

        await prestation.destroy();
        res.json({ message: "Prestation deleted successfully" });
    } catch (error) {
        console.error("Error deleting prestation:", error);
        res.status(500).json({ error: "An error occurred while deleting the prestation." });
    }
});

module.exports = router;