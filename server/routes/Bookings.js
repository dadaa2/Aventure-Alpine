const express = require('express');
const router = express.Router();
const { Book, User, Prestation } = require('../models');
const { Op } = require('sequelize');

// Récupérer toutes les réservations avec pagination
// Récupérer toutes les réservations avec pagination
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    try {
        // Ce tableau stockera toutes les conditions de recherche
        const searchConditions = [];
        
        // Si search est fourni, ajouter les conditions de recherche
        if (search) {
            // Recherche sur les ID de réservation
            searchConditions.push({ id: { [Op.like]: `%${search}%` } });

        }
        
        // Options pour la requête findAndCountAll
        const options = {
            limit: parseInt(limit),
            offset: (page - 1) * parseInt(limit),
            include: [
                { 
                    model: User, 
                    as: 'user', 
                    attributes: ['id', 'mail', 'pseudo', 'firstName', 'lastName'],
                    // Recherche sur l'utilisateur si search est fourni
                    ...(search ? {
                        where: {
                            [Op.or]: [
                                { firstName: { [Op.like]: `%${search}%` } },
                                { lastName: { [Op.like]: `%${search}%` } },
                                { mail: { [Op.like]: `%${search}%` } }
                            ]
                        },
                        required: false // Rend la jointure externe (LEFT JOIN)
                    } : {})
                },
                { 
                    model: Prestation, 
                    as: 'prestation',
                    // Recherche sur la prestation si search est fourni
                    ...(search ? {
                        where: {
                            [Op.or]: [
                                { name: { [Op.like]: `%${search}%` } },
                                { description: { [Op.like]: `%${search}%` } }
                            ]
                        },
                        required: false // Rend la jointure externe (LEFT JOIN)
                    } : {})
                }
            ],
            where: search ? {
                [Op.or]: [
                    ...searchConditions,
                    { '$user.firstName$': { [Op.like]: `%${search}%` } },
                    { '$user.lastName$': { [Op.like]: `%${search}%` } },
                    { '$user.mail$': { [Op.like]: `%${search}%` } },
                    { '$prestation.name$': { [Op.like]: `%${search}%` } },
                    { '$prestation.description$': { [Op.like]: `%${search}%` } }
                ]
            } : {},
            order: [['createdAt', 'DESC']],
            distinct: true
        };
        
        const bookings = await Book.findAndCountAll(options);
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
        
        // Vérifier si l'utilisateur a déjà une réservation pour cette prestation à ces dates
        const existingBooking = await Book.findOne({
            where: {
                userId,
                prestationId,
                [Op.or]: [
                    // Nouvelle date de début entre dates existantes
                    {
                        startPrestation: { [Op.lte]: startPrestation },
                        endPrestation: { [Op.gte]: startPrestation }
                    },
                    // Nouvelle date de fin entre dates existantes
                    {
                        startPrestation: { [Op.lte]: endPrestation },
                        endPrestation: { [Op.gte]: endPrestation }
                    },
                    // Dates existantes comprises entre nouvelles dates
                    {
                        startPrestation: { [Op.gte]: startPrestation },
                        endPrestation: { [Op.lte]: endPrestation }
                    }
                ]
            }
        });
        
        if (existingBooking) {
            return res.status(400).json({ 
                error: "Vous avez déjà réservé cette prestation pour ces dates",
                code: "BOOKING_DATE_CONFLICT",
                existingBooking: {
                    id: existingBooking.id,
                    startDate: existingBooking.startPrestation,
                    endDate: existingBooking.endPrestation
                }
            });
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