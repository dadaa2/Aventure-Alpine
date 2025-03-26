const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aventure-alpine-secret-key';

// Middleware pour vérifier l'authentification
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: "Authentification requise" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

// Middleware pour vérifier les rôles
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentification requise" });
    }
    
    if (allowedRoles.includes(req.user.roleId)) {
      next();
    } else {
      res.status(403).json({ error: "Accès non autorisé" });
    }
  };
};

module.exports = { auth, checkRole, JWT_SECRET };