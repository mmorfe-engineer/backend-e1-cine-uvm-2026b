'use strict';
const { verifyToken } = require('../config/jwt');

/**
 * Middleware de Autenticación JWT
 * Sistema de Gestión de Cine - UVM Backend 2026B - Trabajo 3
 * 
 * Uso:
 *   const authenticateToken = require('../middlewares/auth');
 *   router.get('/protected', authenticateToken, controller);
 */

/**
 * Extrae el token del Authorization header o de cookies
 * @param {Object} req - Request
 * @returns {string|null} Token o null
 */
function extractToken(req) {
  // 1. Buscar en Authorization header (Bearer token)
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  // 2. Buscar en cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  // 3. Buscar en body (para formularios)
  if (req.body && req.body.token) {
    return req.body.token;
  }
  
  return null;
}

/**
 * Middleware que verifica el token JWT
 * Si es válido, agrega req.user con la información del usuario
 * Si no, devuelve error 401
 */
function authenticateToken(req, res, next) {
  const token = extractToken(req);
  
  if (!token) {
    if (req.accepts('html')) {
      return res.status(401).render('errors/401', {
        title: '401 - No autorizado',
        message: 'Token de autenticación requerido. Por favor, inicia sesión.'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Token de autenticación requerido'
    });
  }
  
  // Verificar token
  const user = verifyToken(token);
  
  if (!user) {
    if (req.accepts('html')) {
      return res.status(401).render('errors/401', {
        title: '401 - No autorizado',
        message: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado'
    });
  }
  
  // Agregar usuario al request
  req.user = user;
  
  // Continuar al siguiente middleware/controlador
  next();
}

/**
 * Middleware opcional: Verifica token pero no rechaza (para información pública con contexto de usuario)
 */
function optionalAuth(req, res, next) {
  const token = extractToken(req);
  
  if (token) {
    const user = verifyToken(token);
    if (user) {
      req.user = user;
    }
  }
  
  next();
}

module.exports = {
  authenticateToken,
  optionalAuth
};
