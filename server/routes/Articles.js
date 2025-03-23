const express = require('express');
const router = express.Router();
const { Article } = require('../models')
const { Commentary } = require('../models')

router.get('/', async (req, res) => {
    try {
        const constListOfArticles = await Article.findAll();
        res.json(constListOfArticles);
    }
    catch (error) {
        console.error("Error getting articles:", error);
        res.status(500).json({ error: "An error occurred while getting the articles." });
    }
});

router.post('/create', async (req, res) => {
    try {
        const constArticle = req.body;
        await Article.create(constArticle);
        res.json(constArticle);
    }
    catch (error) {
        console.error("Error creating article:", error);
        res.status(500).json({ error: "An error occurred while creating the article." });
    }
});

router.get("/:constId", async (req, res) => {
    try {
        const constId = req.params.id;
        const article = await Article.findByPk(constId);
        res.json(article);
    }
    catch (error) {
        console.error("Error getting article:", error);
        res.status(500).json({ error: "An error occurred while getting the article." });
    }
  });



module.exports = router;