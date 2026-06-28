'use strict';
const express = require('express');
const router  = express.Router();
const C       = require('../controllers/RoomController');
const { authenticateToken } = require('../middlewares/auth');
const { checkPermission } = require('../middlewares/roles');

// Rutas de vistas (requieren autenticación)
router.get('/view',           authenticateToken, C.viewList);
router.get('/view/new',       authenticateToken, checkPermission('rooms', 'create'), C.viewNew);
router.get('/view/:id/edit',  authenticateToken, checkPermission('rooms', 'update'), C.viewEdit);

// Rutas API
// GET: público (ver salas)
router.get('/',               C.getAll);
router.get('/:id',            C.getById);

// POST, PUT, DELETE: requieren autenticación y permisos
router.post('/',              authenticateToken, checkPermission('rooms', 'create'), C.create);
router.put('/:id',            authenticateToken, checkPermission('rooms', 'update'), C.update);
router.delete('/:id',         authenticateToken, checkPermission('rooms', 'delete'), C.delete);

module.exports = router;
