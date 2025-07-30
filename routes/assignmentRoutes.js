const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload');
const assignmentController = require('../controllers/assignmentController');


router.post(
  '/',
  upload.array('attachments', 10),
  assignmentController.createAssignment
);
router.get('/', assignmentController.getAllAssignments);
router.get('/:id', assignmentController.getAssignmentById);
router.put('/:id', assignmentController.updateAssignment);

module.exports = router;
