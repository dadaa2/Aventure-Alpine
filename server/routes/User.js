const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

// Récupérer tous les utilisateurs avec pagination
router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const users = await User.findAndCountAll({
            limit: parseInt(limit),
            offset: (page - 1) * limit,
        });
        res.json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ error: "An error occurred while getting the users." });
    }
});

// Connexion d'un utilisateur
router.post('/login', async (req, res) => {
    try {
      const { mail, password } = req.body;
      // Trouver l'utilisateur par email
      const user = await User.findOne({ where: { mail } });
      
      // Si l'utilisateur n'existe pas ou mot de passe invalide
      if (!user) {
        return res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }
      
      // Utiliser comparePassword au lieu de validatePassword
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }
      
      // Authentification réussie
      // Ici vous pouvez générer un JWT token ou créer une session
      
      res.json({ 
        id: user.id,
        mail: user.mail,
        pseudo: user.pseudo,
        roleId: user.roleId
        // N'incluez PAS le mot de passe dans la réponse
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ error: "Une erreur est survenue lors de la connexion" });
    }
  });



// Récupérer un utilisateur par ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ error: "An error occurred while getting the user." });
    }
});

// Créer un utilisateur
router.post('/create', async (req, res) => {
    try {
        const { mail, pseudo, password, firstName, lastName, street, city, zipCode } = req.body;

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            mail,
            pseudo,
            password: hashedPassword,
            firstName,
            lastName,
            street,
            city,
            zipCode,
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "An error occurred while creating the user." });
    }
});

// Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await user.update(req.body);
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "An error occurred while updating the user." });
    }
});

// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "An error occurred while deleting the user." });
    }
});

module.exports = router;