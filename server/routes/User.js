const express = require('express');
const router = express.Router();
const { User } = require('../models')

router.get('/', async (req, res) => {
    try {
        const listOfUsers = await User.findAll();
        res.json(listOfUsers);
    }
    catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ error: "An error occurred while getting the users." });
    }
});

router.post('/create', async (req, res) => {
    try {
        const constUser = req.body;
        await User.create(constUser);
        res.json(constUser);
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "An error occurred while creating the user." });
    }
});

module.exports = router;