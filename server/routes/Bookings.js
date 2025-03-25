const express = require('express');
const router = express.Router();
const { Book, User, Prestation } = require('../models');

// Récupérer toutes les réservations avec pagination
router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const bookings = await Book.findAndCountAll({
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            include: [
                { model: User, as: 'user', attributes: ['id', 'mail', 'pseudo', 'firstName', 'lastName'] },
                { model: Prestation, as: 'prestation' }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        console.error("Error getting bookings:", error);
        res.status(500).json({ error: "An error occurred while getting the bookings." });
    }
});

// Récupérer les réservations d'un utilisateur spécifique
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Book.findAll({
            where: { userId: req.params.userId },
            include: [{ model: Prestation, as: 'prestation' }],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        console.error("Error getting user bookings:", error);
        res.status(500).json({ error: "An error occurred while getting the user's bookings." });
    }
});

// Récupérer une réservation par ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Book.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'mail', 'pseudo', 'firstName', 'lastName'] },
                { model: Prestation, as: 'prestation' }
            ]
        });
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json(booking);
    } catch (error) {
        console.error("Error getting booking:", error);
        res.status(500).json({ error: "An error occurred while getting the booking." });
    }
});

// Créer une réservation
router.post('/', async (req, res) => {
    try {
        const { userId, prestationId, startPrestation, endPrestation, numberPerson } = req.body;
        
        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Vérifier si la prestation existe
        const prestation = await Prestation.findByPk(prestationId);
        if (!prestation) {
            return res.status(404).json({ error: "Prestation not found" });
        }
        
        const newBooking = await Book.create({
            userId,
            prestationId,
            startPrestation,
            endPrestation,
            numberPerson,
            star: null,
            commentary: null
        });
        
        // Récupérer la réservation avec les relations pour la renvoyer
        const bookingWithRelations = await Book.findByPk(newBooking.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'mail', 'pseudo', 'firstName', 'lastName'] },
                { model: Prestation, as: 'prestation' }
            ]
        });
        
        res.status(201).json(bookingWithRelations);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "An error occurred while creating the booking." });
    }
});

// Mettre à jour une réservation
router.put('/:id', async (req, res) => {
    try {
        const booking = await Book.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const updatedBooking = await booking.update(req.body);
        
        // Récupérer la réservation mise à jour avec les relations
        const bookingWithRelations = await Book.findByPk(updatedBooking.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'mail', 'pseudo', 'firstName', 'lastName'] },
                { model: Prestation, as: 'prestation' }
            ]
        });
        
        res.json(bookingWithRelations);
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ error: "An error occurred while updating the booking." });
    }
});

// Ajouter un avis (étoiles et commentaire) à une réservation
router.put('/:id/review', async (req, res) => {
    try {
        const { star, commentary } = req.body;
        const booking = await Book.findByPk(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        
        const updatedBooking = await booking.update({
            star,
            commentary
        });
        
        res.json(updatedBooking);
    } catch (error) {
        console.error("Error adding review to booking:", error);
        res.status(500).json({ error: "An error occurred while adding a review to the booking." });
    }
});

// Supprimer une réservation
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Book.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        await booking.destroy();
        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: "An error occurred while deleting the booking." });
    }
});

module.exports = router;