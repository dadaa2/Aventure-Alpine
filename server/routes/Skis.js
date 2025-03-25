const express = require('express');
const router = express.Router();
const db = require('../models');
const { Ski } = db;

// Récupérer tous les détails de ski
router.get('/', async (req, res) => {
  try {
    const skis = await Ski.findAll();
    res.status(200).json(skis);
  } catch (error) {
    console.error('Error fetching ski details:', error);
    res.status(500).json({ error: 'Error fetching ski details' });
  }
});

// Récupérer les détails de ski pour une prestation spécifique
router.get('/prestation/:prestationId', async (req, res) => {
  try {
    const { prestationId } = req.params;
    const skiDetails = await Ski.findOne({ where: { prestationId } });
    
    if (!skiDetails) {
      return res.status(404).json({ error: 'Ski details not found for this prestation' });
    }
    
    res.status(200).json(skiDetails);
  } catch (error) {
    console.error('Error fetching ski details for prestation:', error);
    res.status(500).json({ error: 'Error fetching ski details for prestation' });
  }
});

// Créer de nouveaux détails de ski
router.post('/', async (req, res) => {
  try {
    const { snowCondition, skiLift, pistColor, prestationId } = req.body;
    
    if (!prestationId) {
      return res.status(400).json({ error: 'prestationId is required' });
    }
    
    const newSkiDetails = await Ski.create({
      snowCondition,
      skiLift,
      pistColor,
      prestationId
    });
    
    res.status(201).json(newSkiDetails);
  } catch (error) {
    console.error('Error creating ski details:', error);
    res.status(500).json({ error: 'Error creating ski details' });
  }
});

// Mettre à jour des détails de ski
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { snowCondition, skiLift, pistColor, prestationId } = req.body;
    
    const skiDetails = await Ski.findByPk(id);
    
    if (!skiDetails) {
      return res.status(404).json({ error: 'Ski details not found' });
    }
    
    const updatedSkiDetails = await skiDetails.update({
      snowCondition,
      skiLift,
      pistColor,
      prestationId
    });
    
    res.status(200).json(updatedSkiDetails);
  } catch (error) {
    console.error('Error updating ski details:', error);
    res.status(500).json({ error: 'Error updating ski details' });
  }
});

// Supprimer des détails de ski
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const skiDetails = await Ski.findByPk(id);
    
    if (!skiDetails) {
      return res.status(404).json({ error: 'Ski details not found' });
    }
    
    await skiDetails.destroy();
    
    res.status(200).json({ message: 'Ski details deleted successfully' });
  } catch (error) {
    console.error('Error deleting ski details:', error);
    res.status(500).json({ error: 'Error deleting ski details' });
  }
});

module.exports = router;