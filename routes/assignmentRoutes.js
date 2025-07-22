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
router.get('/assignments/:id', assignmentController.getAssignmentById);
router.put('/assignments/:id', assignmentController.updateAssignment);

module.exports = router;
