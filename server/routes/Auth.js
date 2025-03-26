const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Clé secrète pour les tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'aventure-alpine-secret-key';

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { mail, password } = req.body;
    
    // Trouver l'utilisateur par email
    const user = await User.findOne({ where: { mail } });
    
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    
    // Vérification du mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    
    // Générer un token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        mail: user.mail,
        pseudo: user.pseudo,
        roleId: user.roleId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Renvoyer les informations utilisateur et le token
    res.json({
      user: {
        id: user.id,
        mail: user.mail,
        pseudo: user.pseudo,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId
      },
      token
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Une erreur est survenue lors de la connexion" });
  }
});

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { mail, pseudo, password, firstName, lastName, street, city, zipCode } = req.body;
    
    // Vérification de l'unicité de l'email
    const existingMail = await User.findOne({ where: { mail } });
    if (existingMail) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }
    
    // Vérifier si le pseudo existe déjà
    const existingPseudo = await User.findOne({ where: { pseudo } });
    if (existingPseudo) {
      return res.status(400).json({ error: "Ce pseudo est déjà utilisé" });
    }
    
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer le nouvel utilisateur (roleId 2 pour les utilisateurs normaux)
    const newUser = await User.create({
      mail,
      pseudo,
      password: hashedPassword,
      firstName,
      lastName,
      street,
      city,
      zipCode,
      roleId: 1 // Utilisateur standard
    });
    
    // Générer un token JWT
    const token = jwt.sign(
      { 
        id: newUser.id,
        mail: newUser.mail,
        pseudo: newUser.pseudo,
        roleId: newUser.roleId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Renvoyer les informations utilisateur et le token
    res.status(201).json({
      user: {
        id: newUser.id,
        mail: newUser.mail,
        pseudo: newUser.pseudo,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        roleId: newUser.roleId
      },
      token
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ error: "Une erreur est survenue lors de l'inscription" });
  }
});

// Route pour vérifier un token
router.get('/verify-token', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Aucun token fourni" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Récupérer les informations à jour de l'utilisateur
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'mail', 'pseudo', 'firstName', 'lastName', 'roleId']
    });
    
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    res.json({
      user: user
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
});

module.exports = router;