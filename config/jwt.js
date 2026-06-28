'use strict';
require('dotenv').config();

/**
 * Configuración JWT para autenticación
 * Universidad Valle del Momboy - Trabajo 3 Backend 2026B
 * 
 * Uso:
 *   const { jwtSecret, jwtExpiresIn } = require('../config/jwt');
 */

const jwt = require('jsonwebtoken');

// Validación de variables de entorno obligatorias
const requiredEnvVars = ['JWT_SECRET', 'JWT_EXPIRES_IN'];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.warn(`⚠️  Advertencia: ${varName} no está configurado en .env. Usando valor por defecto (NO SEGURO PARA PRODUCCIÓN)`);
  }
}

const config = {
  // Secreto para firmar tokens JWT
  // En producción: usar al menos 32 caracteres aleatorios
  jwtSecret: process.env.JWT_SECRET || 'clave_secreta_por_defecto_cambiar_en_produccion_12345',
  
  // Tiempo de expiración del token (ej: '1h', '24h', '7d')
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  
  // Algoritmo de firma
  algorithm: 'HS256'
};

/**
 * Genera un token JWT para un usuario
 * @param {Object} user - Objeto de usuario (debe tener id, email, role)
 * @returns {string} Token JWT
 */
function generateToken(user) {
  const payload = {
    sub: user.id,        // Subject (user ID)
    email: user.email,
    role: user.role,
    name: user.name
  };
  
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    algorithm: config.algorithm
  });
}

/**
 * Verifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object|null} Payload decodificado o null si es inválido
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret, { algorithms: [config.algorithm] });
  } catch (err) {
    console.error('❌ Error de verificación JWT:', err.message);
    return null;
  }
}

module.exports = {
  config,
  generateToken,
  verifyToken,
  jwt: jwt
};
