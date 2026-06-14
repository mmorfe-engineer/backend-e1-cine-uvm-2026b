'use strict';
const express = require('express');
const router  = express.Router();
const C       = require('../controllers/ReservationController');

router.get('/',           C.getAll);
router.get('/:id',        C.getById);
router.post('/',          C.create);
router.post('/:id/cancel',C.cancel);
router.put('/:id',        C.update);
router.delete('/:id',     C.delete);
module.exports = router;
