const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

/**
 * @swagger
 * /api/admins/login:
 *   post:
 *     tags: [Admins]
 *     summary: Connecter un administrateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Administrateur connecté
 */
router.post('/login', adminController.login);

module.exports = router;
