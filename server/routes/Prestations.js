const express = require('express');
const router = express.Router();
const { Prestation, Sport } = require('../models');

// Récupérer toutes les prestations avec pagination et sport associé
router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const prestations = await Prestation.findAndCountAll({
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            include: [{ model: Sport, as: 'sport' }]
        });
        res.json(prestations);
    } catch (error) {
        console.error("Error getting prestations:", error);
        res.status(500).json({ error: "An error occurred while getting the prestations." });
    }
});

// Récupérer une prestation par ID
router.get('/:id', async (req, res) => {
    try {
        const prestation = await Prestation.findByPk(req.params.id, {
            include: [{ model: Sport, as: 'sport' }]
        });
        if (!prestation) {
            return res.status(404).json({ error: "Prestation not found" });
        }
        res.json(prestation);
    } catch (error) {
        console.error("Error getting prestation:", error);
        res.status(500).json({ error: "An error occurred while getting the prestation." });
    }
});

// Créer une prestation
router.post('/', async (req, res) => {
    try {
        const { name, price, description, sportId } = req.body;
        const newPrestation = await Prestation.create({
            name,
            price,
            description,
            sportId
        });
        res.status(201).json(newPrestation);
    } catch (error) {
        console.error("Error creating prestation:", error);
        res.status(500).json({ error: "An error occurred while creating the prestation." });
    }
});

// Mettre à jour une prestation
router.put('/:id', async (req, res) => {
    try {
        const prestation = await Prestation.findByPk(req.params.id);
        if (!prestation) {
            return res.status(404).json({ error: "Prestation not found" });
        }
        
        const updatedPrestation = await prestation.update(req.body);
        res.json(updatedPrestation);
    } catch (error) {
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

// Récupérer tous les sports (pour le formulaire de prestation)
router.get('/sports/all', async (req, res) => {
    try {
        const sports = await Sport.findAll();
        res.json(sports);
    } catch (error) {
        console.error("Error getting sports:", error);
        res.status(500).json({ error: "An error occurred while getting the sports." });
    }
});

module.exports = router;