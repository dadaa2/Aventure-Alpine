const express = require('express');
const router = express.Router();
const { Role } = require('../models');

// Récupérer tous les rôles
router.get('/', async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (error) {
        console.error("Error getting roles:", error);
        res.status(500).json({ error: "An error occurred while getting the roles." });
    }
});

// Récupérer un rôle par ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }
        res.json(role);
    } catch (error) {
        console.error("Error getting role:", error);
        res.status(500).json({ error: "An error occurred while getting the role." });
    }
});

// Créer un rôle
router.post('/', async (req, res) => {
    try {
        const { roleName, roleDescription } = req.body;
        const newRole = await Role.create({
            roleName,
            roleDescription
        });
        res.status(201).json(newRole);
    } catch (error) {
        console.error("Error creating role:", error);
        res.status(500).json({ error: "An error occurred while creating the role." });
    }
});

// Mettre à jour un rôle
router.put('/:id', async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }

        const updatedRole = await role.update(req.body);
        res.json(updatedRole);
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ error: "An error occurred while updating the role." });
    }
});

// Supprimer un rôle
router.delete('/:id', async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }

        await role.destroy();
        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({ error: "An error occurred while deleting the role." });
    }
});

module.exports = router;