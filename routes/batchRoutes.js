const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

router.post('/', batchController.createBatch);
router.get('/', batchController.getAllBatches);
router.delete('/:batchId', batchController.deleteBatch);

router.post('/:batchId/students', batchController.addStudentsToBatch);
router.get('/:batchId', batchController.getBatchDetailsById);

module.exports = router;
