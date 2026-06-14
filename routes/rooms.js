'use strict';
const express = require('express');
const router  = express.Router();
const C       = require('../controllers/RoomController');

router.get('/view',           C.viewList);
router.get('/view/new',       C.viewNew);
router.get('/view/:id/edit',  C.viewEdit);
router.get('/',               C.getAll);
router.get('/:id',            C.getById);
router.post('/',              C.create);
router.put('/:id',            C.update);
router.delete('/:id',         C.delete);
module.exports = router;
