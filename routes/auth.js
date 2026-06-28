'use strict';
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middlewares/auth');

/**
 * Rutas de Autenticación
 * Sistema de Gestión de Cine - UVM Backend 2026B - Trabajo 3
 * 
 * Endpoints:
 *   GET  /auth/login    - Formulario de login
 *   POST /auth/login    - Iniciar sesión
 *   GET  /auth/register - Formulario de registro
 *   POST /auth/register - Registrar usuario
 *   POST /auth/logout   - Cerrar sesión
 *   GET  /auth/profile  - Perfil del usuario (requiere auth)
 */

// Formularios (Vistas EJS)
router.get('/login', AuthController.viewLogin);
router.get('/register', AuthController.viewRegister);
router.get('/profile', authenticateToken, AuthController.viewProfile);

// API Endpoints
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);

module.exports = router;
