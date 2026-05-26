const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');

router.get('/', MovieController.getAll);
router.get('/:id', MovieController.getById);
router.post('/', MovieController.create);
router.put('/:id', MovieController.update);
router.delete('/:id', MovieController.delete);

module.exports = router;
