'use strict';
const express = require('express');
const router  = express.Router();
const C       = require('../controllers/FunctionController');
const { authenticateToken } = require('../middlewares/auth');
const { checkPermission } = require('../middlewares/roles');

// Rutas públicas (ver funciones programadas)
router.get('/last5',       C.getLast5);
router.get('/range',       C.getByDateRange);
router.get('/',            C.getAll);
router.get('/:id',         C.getById);

// Rutas protegidas (requieren autenticación y permisos)
router.post('/',           authenticateToken, checkPermission('functions', 'create'), C.create);
router.put('/:id',         authenticateToken, checkPermission('functions', 'update'), C.update);
router.delete('/:id/movie', authenticateToken, checkPermission('functions', 'update'), C.unlinkMovie);
router.delete('/:id',      authenticateToken, checkPermission('functions', 'delete'), C.delete);

module.exports = router;
