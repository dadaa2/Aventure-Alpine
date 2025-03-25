const express = require('express');
const router = express.Router();
const db = require('../models');
const { Sport } = db;

// Récupérer tous les sports
router.get('/', async (req, res) => {
  try {
    const sports = await Sport.findAll();
    res.status(200).json(sports);
  } catch (error) {
    console.error('Error fetching sports:', error);
    res.status(500).json({ error: 'Error fetching sports' });
  }
});

// Récupérer un sport par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sport = await Sport.findByPk(id);
    
    if (!sport) {
      return res.status(404).json({ error: 'Sport not found' });
    }
    
    res.status(200).json(sport);
  } catch (error) {
    console.error('Error fetching sport:', error);
    res.status(500).json({ error: 'Error fetching sport' });
  }
});

// Créer un nouveau sport
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Sport name is required' });
    }
    
    const newSport = await Sport.create({ name });
    res.status(201).json(newSport);
  } catch (error) {
    console.error('Error creating sport:', error);
    res.status(500).json({ error: 'Error creating sport' });
  }
});

// Mettre à jour un sport
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const sport = await Sport.findByPk(id);
    
    if (!sport) {
      return res.status(404).json({ error: 'Sport not found' });
    }
    
    const updatedSport = await sport.update({ name });
    res.status(200).json(updatedSport);
  } catch (error) {
    console.error('Error updating sport:', error);
    res.status(500).json({ error: 'Error updating sport' });
  }
});

// Supprimer un sport
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sport = await Sport.findByPk(id);
    
    if (!sport) {
      return res.status(404).json({ error: 'Sport not found' });
    }
    
    await sport.destroy();
    
    res.status(200).json({ message: 'Sport deleted successfully' });
  } catch (error) {
    console.error('Error deleting sport:', error);
    res.status(500).json({ error: 'Error deleting sport' });
  }
});

module.exports = router;