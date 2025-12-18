const express = require('express');
const router = express.Router();
const controller = require('../controllers/classWorkController');

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

// Create classwork
router.post('/', controller.addClassWork);

// Update classwork
router.put('/:id', controller.updateClassWork);

// Delete classwork
router.delete('/:id', controller.deleteClassWork);

/**
 * =========================
 * READ ROUTES (ADMIN / STUDENT)
 * Order matters: specific → generic
 * =========================
 */

// Get classwork by batch + date
router.get('/batch/:batchId/date/:date', controller.getClassWorkByBatchAndDate);

// Get classwork by batch + subject
router.get('/batch/:batchId/subject/:subjectId', controller.getClassWorkBySubject);

// Get classwork by batch
router.get('/batch/:batchId', controller.getClassWorkByBatch);

// Get classwork by id (keep LAST)
router.get('/:id', controller.getClassWorkById);

module.exports = router;
