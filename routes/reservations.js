'use strict';
const express = require('express');
const router  = express.Router();
const C       = require('../controllers/ReservationController');
const { authenticateToken } = require('../middlewares/auth');
const { checkPermission, isAdminOrStaff } = require('../middlewares/roles');

// Rutas de vistas
router.get('/view',           authenticateToken, C.viewList);
router.get('/view/new',       authenticateToken, checkPermission('reservations', 'create'), C.viewNew);
router.get('/view/:id/edit',  authenticateToken, checkPermission('reservations', 'update'), C.viewEdit);

// Rutas API
// Ver todas las reservaciones: solo admin/staff
router.get('/',              authenticateToken, isAdminOrStaff, C.getAll);
router.get('/:id',           authenticateToken, C.getById); // Ver propia reservación

// Crear reservación: cualquier usuario autenticado
router.post('/',             authenticateToken, checkPermission('reservations', 'create'), C.create);

// Cancelar reservación: viewer puede cancelar la suya, admin/staff pueden cancelar cualquier
router.post('/:id/cancel',   authenticateToken, C.cancel);

// Actualizar/Eliminar: admin/staff
router.put('/:id',           authenticateToken, checkPermission('reservations', 'update'), C.update);
router.delete('/:id',        authenticateToken, checkPermission('reservations', 'delete'), C.delete);

module.exports = router;
