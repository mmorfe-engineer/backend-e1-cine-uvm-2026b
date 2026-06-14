'use strict';
const express = require('express');
const router  = express.Router();
const C       = require('../controllers/TicketController');

router.get('/function/:functionId', C.getByFunction);
router.get('/',                     C.getAll);
router.get('/:id',                  C.getById);
router.post('/',                    C.create);
router.post('/:id/reserve',         C.reserve);
router.put('/:id',                  C.update);
router.delete('/:id',               C.delete);
module.exports = router;
