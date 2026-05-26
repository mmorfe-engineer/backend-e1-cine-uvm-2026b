const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/ReservationController');

router.get('/', ReservationController.getAll);
router.get('/:id', ReservationController.getById);
router.post('/', ReservationController.create);
router.put('/:id', ReservationController.update);
router.post('/:id/cancel', ReservationController.cancel);
router.delete('/:id', ReservationController.delete);

module.exports = router;
