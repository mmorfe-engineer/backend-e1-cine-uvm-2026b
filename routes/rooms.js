const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/RoomController');

router.get('/', RoomController.getAll);
router.get('/:id', RoomController.getById);
router.post('/', RoomController.create);
router.put('/:id', RoomController.update);
router.delete('/:id', RoomController.delete);

module.exports = router;
