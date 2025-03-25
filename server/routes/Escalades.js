const express = require('express');
const router = express.Router();
const db = require('../models');
const { Escalade } = db;

// Récupérer tous les détails d'escalade
router.get('/', async (req, res) => {
  try {
    const escalades = await Escalade.findAll();
    res.status(200).json(escalades);
  } catch (error) {
    console.error('Error fetching escalade details:', error);
    res.status(500).json({ error: 'Error fetching escalade details' });
  }
});

// Récupérer les détails d'escalade pour une prestation spécifique
router.get('/prestation/:prestationId', async (req, res) => {
  try {
    const { prestationId } = req.params;
    const escaladeDetails = await Escalade.findOne({ where: { prestationId } });
    
    if (!escaladeDetails) {
      return res.status(404).json({ error: 'Escalade details not found for this prestation' });
    }
    
    res.status(200).json(escaladeDetails);
  } catch (error) {
    console.error('Error fetching escalade details for prestation:', error);
    res.status(500).json({ error: 'Error fetching escalade details for prestation' });
  }
});

// Créer de nouveaux détails d'escalade
router.post('/', async (req, res) => {
  try {
    const { difficulty, ascentionTime, location, prestationId } = req.body;
    
    if (!prestationId) {
      return res.status(400).json({ error: 'prestationId is required' });
    }
    
    const newEscaladeDetails = await Escalade.create({
      difficulty,
      ascentionTime,
      location,
      prestationId
    });
    
    res.status(201).json(newEscaladeDetails);
  } catch (error) {
    console.error('Error creating escalade details:', error);
    res.status(500).json({ error: 'Error creating escalade details' });
  }
});

// Mettre à jour des détails d'escalade
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { difficulty, ascentionTime, location, prestationId } = req.body;
    
    const escaladeDetails = await Escalade.findByPk(id);
    
    if (!escaladeDetails) {
      return res.status(404).json({ error: 'Escalade details not found' });
    }
    
    const updatedEscaladeDetails = await escaladeDetails.update({
      difficulty,
      ascentionTime,
      location,
      prestationId
    });
    
    res.status(200).json(updatedEscaladeDetails);
  } catch (error) {
    console.error('Error updating escalade details:', error);
    res.status(500).json({ error: 'Error updating escalade details' });
  }
});

// Supprimer des détails d'escalade
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const escaladeDetails = await Escalade.findByPk(id);
    
    if (!escaladeDetails) {
      return res.status(404).json({ error: 'Escalade details not found' });
    }
    
    await escaladeDetails.destroy();
    
    res.status(200).json({ message: 'Escalade details deleted successfully' });
  } catch (error) {
    console.error('Error deleting escalade details:', error);
    res.status(500).json({ error: 'Error deleting escalade details' });
  }
});

module.exports = router;