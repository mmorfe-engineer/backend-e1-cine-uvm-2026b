'use strict';
const express = require('express');
const router  = express.Router();
const C       = require('../controllers/MovieController');
const { authenticateToken } = require('../middlewares/auth');
const { checkPermission } = require('../middlewares/roles');

// Rutas de vistas (requieren autenticación)
router.get('/view',           authenticateToken, C.viewList);
router.get('/view/new',       authenticateToken, checkPermission('movies', 'create'), C.viewNew);
router.get('/view/:id/edit',  authenticateToken, checkPermission('movies', 'update'), C.viewEdit);

// Rutas API
// GET: público (ver películas - requerimiento del profesor)
router.get('/:id/functions',  C.getWithFunctions);
router.get('/',               C.getAll);
router.get('/:id',            C.getById);

// POST, PUT, DELETE: requieren autenticación y permisos
router.post('/',              authenticateToken, checkPermission('movies', 'create'), C.create);
router.put('/:id',            authenticateToken, checkPermission('movies', 'update'), C.update);
router.delete('/:id',         authenticateToken, checkPermission('movies', 'delete'), C.delete);

module.exports = router;
