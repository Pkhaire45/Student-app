const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeWorkController');

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

// Create homework
router.post('/', controller.addHomeWork);

// Update homework
router.put('/:id', controller.updateHomeWork);

// Delete homework
router.delete('/:id', controller.deleteHomeWork);

/**
 * =========================
 * READ ROUTES (ADMIN / STUDENT)
 * Order matters: specific → generic
 * =========================
 */

// Get homework by batch + date
router.get('/batch/:batchId/date/:date', controller.getHomeWorkByBatchAndDate);

// Get homework by batch + subject
router.get('/batch/:batchId/subject/:subjectId', controller.getHomeWorkBySubject);

// Get homework by batch
router.get('/batch/:batchId', controller.getHomeWorkByBatch);

// Get homework by id (keep LAST)
router.get('/:id', controller.getHomeWorkById);

module.exports = router;
