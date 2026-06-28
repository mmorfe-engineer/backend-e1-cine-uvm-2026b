'use strict';

/**
 * Middleware de Autorización por Roles
 * Sistema de Gestión de Cine - UVM Backend 2026B - Trabajo 3
 * 
 * Uso:
 *   const { checkRole, checkPermission } = require('../middlewares/roles');
 *   router.get('/admin', checkRole(['admin']), controller);
 */

/**
 * Matriz de permisos por rol
 * 
 * Estructura: {
 *   recurso: {
 *     accion: [roles_permitidos]
 *   }
 * }
 */
const permissions = {
  // Autenticación
  auth: {
    register: ['admin'], // Solo admin puede registrar usuarios
    login: ['admin', 'staff', 'viewer'],
    logout: ['admin', 'staff', 'viewer'],
    profile: ['admin', 'staff', 'viewer']
  },
  
  // Usuarios (solo admin puede gestionar)
  users: {
    read: ['admin'],
    create: ['admin'],
    update: ['admin'],
    delete: ['admin'],
    list: ['admin']
  },
  
  // Películas
  movies: {
    read: ['admin', 'staff', 'viewer'],   // Ver películas (público también puede ver activas)
    readAll: ['admin', 'staff', 'viewer'],  // Listar todas
    create: ['admin', 'staff'],
    update: ['admin', 'staff'],
    delete: ['admin']  // Operación exclusiva de admin
  },
  
  // Salas
  rooms: {
    read: ['admin', 'staff', 'viewer'],
    readAll: ['admin', 'staff', 'viewer'],
    create: ['admin', 'staff'],
    update: ['admin', 'staff'],
    delete: ['admin']  // Operación exclusiva de admin
  },
  
  // Funciones
  functions: {
    read: ['admin', 'staff', 'viewer'],
    readAll: ['admin', 'staff', 'viewer'],
    create: ['admin', 'staff'],  // Operación exclusiva de staff/admin
    update: ['admin', 'staff'],
    delete: ['admin']
  },
  
  // Tickets
  tickets: {
    read: ['admin', 'staff'],  // Ver todos los tickets (exclusivo staff/admin)
    readAll: ['admin', 'staff'],
    create: ['admin', 'staff'],
    update: ['admin', 'staff'],
    delete: ['admin', 'staff'],
    reserve: ['admin', 'staff', 'viewer']  // Reservar ticket (viewer puede)
  },
  
  // Reservaciones
  reservations: {
    read: ['admin', 'staff'],  // Ver todas las reservaciones (exclusivo staff/admin)
    readAll: ['admin', 'staff'],
    create: ['admin', 'staff', 'viewer'],
    update: ['admin', 'staff'],
    delete: ['admin', 'staff'],
    cancel: ['admin', 'staff', 'viewer']  // Cancelar propia reservación
  }
};

/**
 * Verifica si el usuario tiene el rol requerido
 * @param {string[]} allowedRoles - Roles permitidos
 * @returns {Function} Middleware
 */
function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    const user = req.user;
    
    // Si no hay usuario autenticado
    if (!user) {
      if (req.accepts('html')) {
        return res.status(401).render('errors/401', {
          title: '401 - No autorizado',
          message: 'Debes iniciar sesión para acceder a esta área.'
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Token de autenticación requerido'
      });
    }
    
    // Verificar si el usuario tiene uno de los roles permitidos
    const userRole = user.role || 'viewer';
    
    if (!allowedRoles.includes(userRole)) {
      if (req.accepts('html')) {
        return res.status(403).render('errors/403', {
          title: '403 - Prohibido',
          message: `No tienes permisos para acceder a esta área. Rol requerido: ${allowedRoles.join(', ')}. Tu rol: ${userRole}`
        });
      }
      return res.status(403).json({
        success: false,
        error: `No autorizado. Rol requerido: ${allowedRoles.join(', ')}`
      });
    }
    
    // Permitir acceso
    next();
  };
}

/**
 * Verifica permiso para un recurso y acción específicos
 * @param {string} resource - Recurso (ej: 'movies', 'rooms')
 * @param {string} action - Acción (ej: 'read', 'create', 'delete')
 * @returns {Function} Middleware
 */
function checkPermission(resource, action) {
  return (req, res, next) => {
    const user = req.user;
    
    // Si no hay usuario autenticado
    if (!user) {
      if (req.accepts('html')) {
        return res.status(401).render('errors/401', {
          title: '401 - No autorizado',
          message: 'Debes iniciar sesión para acceder a esta área.'
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Token de autenticación requerido'
      });
    }
    
    const userRole = user.role || 'viewer';
    const resourcePerms = permissions[resource];
    
    // Si el recurso no está definido, denegar por defecto
    if (!resourcePerms) {
      if (req.accepts('html')) {
        return res.status(403).render('errors/403', {
          title: '403 - Prohibido',
          message: 'No tienes permisos para acceder a este recurso.'
        });
      }
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }
    
    const allowedRoles = resourcePerms[action];
    
    // Si la acción no está definida, denegar
    if (!allowedRoles) {
      if (req.accepts('html')) {
        return res.status(403).render('errors/403', {
          title: '403 - Prohibido',
          message: 'No tienes permisos para esta acción.'
        });
      }
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }
    
    // Verificar permiso
    if (!allowedRoles.includes(userRole)) {
      if (req.accepts('html')) {
        return res.status(403).render('errors/403', {
          title: '403 - Prohibido',
          message: `No tienes permisos para ${action} ${resource}. Tu rol: ${userRole}`
        });
      }
      return res.status(403).json({
        success: false,
        error: `No autorizado. Acción: ${action} en ${resource}`
      });
    }
    
    // Permitir acceso
    next();
  };
}

/**
 * Middleware para verificar si el usuario es admin
 */
function isAdmin(req, res, next) {
  return checkRole(['admin'])(req, res, next);
}

/**
 * Middleware para verificar si el usuario es admin o staff
 */
function isAdminOrStaff(req, res, next) {
  return checkRole(['admin', 'staff'])(req, res, next);
}

module.exports = {
  checkRole,
  checkPermission,
  isAdmin,
  isAdminOrStaff,
  permissions  // Exportar matriz de permisos para referencia
};
