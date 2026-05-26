const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');

router.get('/', TicketController.getAll);
router.get('/:functionId', TicketController.getByFunction);
router.get('/:id', TicketController.getById);
router.post('/', TicketController.create);
router.post('/:id/reserve', TicketController.reserve);
router.put('/:id', TicketController.update);
router.delete('/:id', TicketController.delete);

module.exports = router;
