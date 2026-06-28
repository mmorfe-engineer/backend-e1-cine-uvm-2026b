'use strict';
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

/**
 * Controlador de Autenticación
 * Sistema de Gestión de Cine - UVM Backend 2026B - Trabajo 3
 * 
 * Uso:
 *   const AuthController = require('../controllers/AuthController');
 */

class AuthController {
  
  /**
   * Renderiza el formulario de login
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  static viewLogin(req, res) {
    res.render('auth/login', {
      title: 'Iniciar Sesión - Sistema de Cine UVM',
      error: req.flash('error')
    });
  }
  
  /**
   * Renderiza el formulario de registro
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  static viewRegister(req, res) {
    res.render('auth/register', {
      title: 'Registro - Sistema de Cine UVM'
    });
  }
  
  /**
   * Renderiza el perfil del usuario
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  static async viewProfile(req, res) {
    try {
      const user = req.user;
      res.render('auth/profile', {
        title: 'Mi Perfil - Sistema de Cine UVM',
        user: user
      });
    } catch (err) {
      res.status(500).render('errors/500', {
        title: 'Error',
        message: 'Error al cargar el perfil'
      });
    }
  }
  
  /**
   * Registra un nuevo usuario
   * POST /auth/register
   * @param {Object} req - Request (body: name, email, password, role)
   * @param {Object} res - Response
   */
  static async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      
      // Validación básica
      if (!name || !email || !password) {
        if (req.accepts('html')) {
          return res.render('auth/register', {
            title: 'Registro - Sistema de Cine UVM',
            error: 'Nombre, email y contraseña son requeridos',
            old: { name, email, role }
          });
        }
        return res.status(400).json({
          success: false,
          error: 'name, email y password son requeridos'
        });
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (req.accepts('html')) {
          return res.render('auth/register', {
            title: 'Registro - Sistema de Cine UVM',
            error: 'Email no es válido',
            old: { name, email, role }
          });
        }
        return res.status(400).json({
          success: false,
          error: 'email no es válido'
        });
      }
      
      // Validar longitud de password
      if (password.length < 8) {
        if (req.accepts('html')) {
          return res.render('auth/register', {
            title: 'Registro - Sistema de Cine UVM',
            error: 'La contraseña debe tener al menos 8 caracteres',
            old: { name, email, role }
          });
        }
        return res.status(400).json({
          success: false,
          error: 'password debe tener al menos 8 caracteres'
        });
      }
      
      // Validar rol
      const validRoles = ['admin', 'staff', 'viewer'];
      const userRole = role && validRoles.includes(role) ? role : 'viewer';
      
      // Crear usuario
      const user = await User.create({
        name,
        email,
        password,
        role: userRole
      });
      
      // Generar token
      const token = generateToken(user);
      
      // Responder según Accept header
      if (req.accepts('html')) {
        // Para vistas EJS, redirigir o mostrar mensaje
        res.render('auth/login', {
          title: 'Iniciar Sesión - Sistema de Cine UVM',
          success: 'Registro exitoso. Ahora puedes iniciar sesión.',
          token: token
        });
      } else {
        res.status(201).json({
          success: true,
          message: 'Usuario registrado con éxito',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        });
      }
      
    } catch (err) {
      if (err.message.includes('email ya está en uso')) {
        if (req.accepts('html')) {
          return res.render('auth/register', {
            title: 'Registro - Sistema de Cine UVM',
            error: 'Este email ya está registrado',
            old: { name: req.body.name, email: req.body.email, role: req.body.role }
          });
        }
        return res.status(400).json({
          success: false,
          error: 'email ya está en uso'
        });
      }
      
      console.error('Error en registro:', err.message);
      if (req.accepts('html')) {
        res.status(500).render('errors/500', {
          title: 'Error',
          message: 'Error interno del servidor'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }
    }
  }
  
  /**
   * Inicia sesión y genera token JWT
   * POST /auth/login
   * @param {Object} req - Request (body: email, password)
   * @param {Object} res - Response
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validación
      if (!email || !password) {
        if (req.accepts('html')) {
          return res.render('auth/login', {
            title: 'Iniciar Sesión - Sistema de Cine UVM',
            error: 'Email y contraseña son requeridos'
          });
        }
        return res.status(400).json({
          success: false,
          error: 'email y password son requeridos'
        });
      }
      
      // Buscar usuario
      const user = await User.findByEmailAndPassword(email, password);
      
      if (!user) {
        if (req.accepts('html')) {
          return res.render('auth/login', {
            title: 'Iniciar Sesión - Sistema de Cine UVM',
            error: 'Credenciales inválidas'
          });
        }
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }
      
      // Generar token
      const token = generateToken(user);
      
      // Responder
      if (req.accepts('html')) {
        // Para vistas, podemos guardarlo en cookie o devolverlo
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/');
      } else {
        res.json({
          success: true,
          message: 'Login exitoso',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        });
      }
      
    } catch (err) {
      console.error('Error en login:', err.message);
      if (req.accepts('html')) {
        res.status(500).render('errors/500', {
          title: 'Error',
          message: 'Error interno del servidor'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }
    }
  }
  
  /**
   * Cierra sesión (para vistas)
   * POST /auth/logout
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  static logout(req, res) {
    if (req.accepts('html')) {
      res.clearCookie('token');
      res.redirect('/auth/login');
    } else {
      res.json({
        success: true,
        message: 'Sesión cerrada'
      });
    }
  }
  
  /**
   * Obtiene el perfil del usuario autenticado
   * GET /auth/profile
   * @param {Object} req - Request (req.user debe estar definido por middleware)
   * @param {Object} res - Response
   */
  static async profile(req, res) {
    try {
      const user = req.user;
      
      if (!user) {
        if (req.accepts('html')) {
          return res.status(401).render('errors/401', {
            title: 'No autorizado',
            message: 'Debes iniciar sesión'
          });
        }
        return res.status(401).json({
          success: false,
          error: 'No autorizado'
        });
      }
      
      // Buscar usuario completo
      const fullUser = await User.findById(user.sub || user.id);
      
      if (!fullUser) {
        if (req.accepts('html')) {
          return res.status(404).render('errors/404', {
            title: 'Usuario no encontrado',
            message: 'Usuario no encontrado'
          });
        }
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }
      
      // Responder (sin password_hash)
      const userData = { ...fullUser };
      delete userData.password_hash;
      
      if (req.accepts('html')) {
        res.render('auth/profile', {
          title: 'Mi Perfil',
          user: userData
        });
      } else {
        res.json({
          success: true,
          user: userData
        });
      }
      
    } catch (err) {
      console.error('Error en profile:', err.message);
      if (req.accepts('html')) {
        res.status(500).render('errors/500', {
          title: 'Error',
          message: 'Error interno del servidor'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        });
      }
    }
  }
}

module.exports = AuthController;
