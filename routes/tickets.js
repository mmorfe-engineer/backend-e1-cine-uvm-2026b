'use strict';
const express = require('express');
const router  = express.Router();
const C       = require('../controllers/TicketController');
const { authenticateToken } = require('../middlewares/auth');
const { checkPermission } = require('../middlewares/roles');

// Rutas protegidas: solo admin/staff pueden ver todos los tickets
router.get('/function/:functionId', authenticateToken, checkPermission('tickets', 'read'), C.getByFunction);
router.get('/',                     authenticateToken, checkPermission('tickets', 'read'), C.getAll);
router.get('/:id',                  authenticateToken, checkPermission('tickets', 'read'), C.getById);

// Crear ticket: admin/staff
router.post('/',                    authenticateToken, checkPermission('tickets', 'create'), C.create);

// Reservar ticket: cualquier usuario autenticado (viewer, staff, admin)
router.post('/:id/reserve',         authenticateToken, checkPermission('tickets', 'reserve'), C.reserve);

// Actualizar/Eliminar: admin/staff
router.put('/:id',                  authenticateToken, checkPermission('tickets', 'update'), C.update);
router.delete('/:id',               authenticateToken, checkPermission('tickets', 'delete'), C.delete);

module.exports = router;
