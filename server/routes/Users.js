const express = require('express');
const router = express.Router();
const { Users } = require('../models')

router.get('/', async (req, res) => {
    const listOfUsers = await  Users.findAll();
    res.json(listOfUsers);
});

router.post('/', async (req, res) => {
    const users = req.body;
    await Users.create(users);
    res.json(users);
});

module.exports = router;