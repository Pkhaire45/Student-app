const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/batches", require("./batch.routes"));
router.use("/students", require("./student.routes"));
router.use("/teachers", require("./teacher.routes"));
router.use("/tests", require("./test.routes"));
router.use("/attendance", require("./attendance.routes"));
router.use("/assignments", require("./assignment.routes"));
router.use("/homework", require("./homework.routes"));
router.use("/classwork", require("./classWork.routes"));
module.exports = router;
