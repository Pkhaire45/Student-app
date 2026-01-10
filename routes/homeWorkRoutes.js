const express = require("express");
const router = express.Router();
const controller = require("../controllers/homeWorkController");
const auth = require("../middleware/authMiddleware");

/**
 * =========================
 * WRITE ROUTES (AUTH ONLY)
 * =========================
 */

// Create homework
router.post(
  "/",
  auth,
  controller.addHomeWork
);

// Update homework
router.put(
  "/:id",
  auth,
  controller.updateHomeWork
);

// Delete homework
router.delete(
  "/:id",
  auth,
  controller.deleteHomeWork
);

/**
 * =========================
 * READ ROUTES (AUTH ONLY)
 * Order matters: specific → generic
 * =========================
 */

// Get homework by batch + date
router.get(
  "/batch/:batchId/date/:date",
  auth,
  controller.getHomeWorkByBatchAndDate
);

// Get homework by batch
router.get(
  "/batch/:batchId",
  auth,
  controller.getHomeWorkByBatch
);

// Get homeworks (list / filters)
// supports query params: batchId, date, startDate, endDate, creatorId, page, limit
router.get(
  "/",
  auth,
  controller.getHomeWorks
);

// Get homework by id (keep LAST)
router.get(
  "/:id",
  auth,
  controller.getHomeWorkById
);

module.exports = router;
