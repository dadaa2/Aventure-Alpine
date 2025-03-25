const express = require('express');
const router = express.Router();
const db = require('../models');
const { Randonne } = db; // Assurez-vous que le nom correspond à votre modèle

// Récupérer tous les détails de randonnée
router.get('/', async (req, res) => {
  try {
    const randonnes = await Randonne.findAll();
    res.status(200).json(randonnes);
  } catch (error) {
    console.error('Error fetching randonnée details:', error);
    res.status(500).json({ error: 'Error fetching randonnée details' });
  }
});

// Récupérer les détails de randonnée pour une prestation spécifique
router.get('/prestation/:prestationId', async (req, res) => {
  try {
    const { prestationId } = req.params;
    const randonneDetails = await Randonne.findOne({ where: { prestationId } });
    
    if (!randonneDetails) {
      return res.status(404).json({ error: 'Randonnée details not found for this prestation' });
    }
    
    res.status(200).json(randonneDetails);
  } catch (error) {
    console.error('Error fetching randonnée details for prestation:', error);
    res.status(500).json({ error: 'Error fetching randonnée details for prestation' });
  }
});

// Créer de nouveaux détails de randonnée
router.post('/', async (req, res) => {
  try {
    const { regionName, distance, startPoint, endPoint, praticable, prestationId } = req.body;
    
    if (!prestationId) {
      return res.status(400).json({ error: 'prestationId is required' });
    }
    
    const newRandonneDetails = await Randonne.create({
      regionName,
      distance,
      startPoint,
      endPoint,
      praticable,
      prestationId
    });
    
    res.status(201).json(newRandonneDetails);
  } catch (error) {
    console.error('Error creating randonnée details:', error);
    res.status(500).json({ error: 'Error creating randonnée details' });
  }
});

// Mettre à jour des détails de randonnée
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { regionName, distance, startPoint, endPoint, praticable, prestationId } = req.body;
    
    const randonneDetails = await Randonne.findByPk(id);
    
    if (!randonneDetails) {
      return res.status(404).json({ error: 'Randonnée details not found' });
    }
    
    const updatedRandonneDetails = await randonneDetails.update({
      regionName,
      distance,
      startPoint,
      endPoint,
      praticable,
      prestationId
    });
    
    res.status(200).json(updatedRandonneDetails);
  } catch (error) {
    console.error('Error updating randonnée details:', error);
    res.status(500).json({ error: 'Error updating randonnée details' });
  }
});

// Supprimer des détails de randonnée
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const randonneDetails = await Randonne.findByPk(id);
    
    if (!randonneDetails) {
      return res.status(404).json({ error: 'Randonnée details not found' });
    }
    
    await randonneDetails.destroy();
    
    res.status(200).json({ message: 'Randonnée details deleted successfully' });
  } catch (error) {
    console.error('Error deleting randonnée details:', error);
    res.status(500).json({ error: 'Error deleting randonnée details' });
  }
});

module.exports = router;