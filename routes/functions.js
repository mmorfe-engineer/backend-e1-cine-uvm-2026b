const express = require('express');
const router = express.Router();
const FunctionController = require('../controllers/FunctionController');

router.get('/', FunctionController.getAll);
router.get('/last5', FunctionController.getLast5);
router.get('/range', FunctionController.getByDateRange);
router.get('/:id', FunctionController.getById);
router.post('/', FunctionController.create);
router.put('/:id', FunctionController.update);
router.delete('/:id', FunctionController.delete);
router.delete('/:id/movie', FunctionController.deleteByMovie);

module.exports = router;
