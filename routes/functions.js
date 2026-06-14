'use strict';
const express = require('express');
const router  = express.Router();
const C       = require('../controllers/FunctionController');

router.get('/last5',       C.getLast5);
router.get('/range',       C.getByDateRange);
router.get('/',            C.getAll);
router.get('/:id',         C.getById);
router.post('/',           C.create);
router.put('/:id',         C.update);
router.delete('/:id/movie',C.unlinkMovie);
router.delete('/:id',      C.delete);
module.exports = router;
