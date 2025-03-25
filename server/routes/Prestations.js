const express = require('express');
const router = express.Router();
const db = require('../models');
const { Prestation, Sport } = db;

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

// Route pour récupérer toutes les prestations
router.get('/', async (req, res) => {
  try {
    const prestations = await Prestation.findAll({
      include: [{ model: Sport, as: 'sport' }]
    });
    
    // Pour chaque prestation, récupérer les détails du sport
    const prestationsWithDetails = await Promise.all(prestations.map(async (prestation) => {
      const prestationData = prestation.toJSON();
      
      // Ajouter une vérification que sport existe et a un nom
      if (!prestationData.sport) {
        prestationData.sportDetails = null;
        return prestationData;
      }
      
      const sportType = prestationData.sport.name.toLowerCase();
      
      let sportDetails = null;
      if (sportType === 'ski') {
        sportDetails = await db.Ski.findOne({ where: { prestationId: prestationData.id } });
      } else if (sportType === 'randonnée') {
        // Utiliser Randonne au lieu de Randonnee
        sportDetails = await db.Randonne.findOne({ where: { prestationId: prestationData.id } });
      } else if (sportType === 'escalade') {
        sportDetails = await db.Escalade.findOne({ where: { prestationId: prestationData.id } });
      }
      
      prestationData.sportDetails = sportDetails;
      return prestationData;
    }));
    
    res.status(200).json(prestationsWithDetails);
  } catch (error) {
    console.error("Error fetching prestations:", error);
    res.status(500).json({ error: "An error occurred while fetching prestations." });
  }
});

// Modifier la route GET pour récupérer une prestation par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer la prestation avec son sport associé
    const prestation = await Prestation.findByPk(id, {
      include: [
        { 
          model: Sport,
          as: 'sport',  // Ajout de l'alias 'sport'
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!prestation) {
      return res.status(404).json({ error: "Prestation not found" });
    }
    
    // Récupérer les détails spécifiques au sport
    let sportDetails = null;
    const sportType = prestation.sport.name.toLowerCase();
    
    if (sportType === 'ski') {
      sportDetails = await db.Ski.findOne({ where: { prestationId: prestation.id } });
    } else if (sportType === 'randonnée') {
      sportDetails = await db.Randonnee.findOne({ where: { prestationId: prestation.id } });
    } else if (sportType === 'escalade') {
      sportDetails = await db.Escalade.findOne({ where: { prestationId: prestation.id } });
    }
    
    // Ajouter les détails du sport à la réponse
    const result = prestation.toJSON();
    result.sportDetails = sportDetails;
    
    res.status(200).json(result);
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