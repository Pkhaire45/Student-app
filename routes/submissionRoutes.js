const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const multer = require('multer');
const submissionUpload = multer({ dest: 'uploads/submissions/' });

router.post('/', submissionUpload.array('submitted_files'), submissionController.submitAssignment);
router.get('/assignment/:assignment_id', submissionController.getSubmissionsByAssignment);
router.get('/assignment/:assignment_id/student/:student_id', submissionController.getSubmissionByStudent);
router.put('/:id', submissionController.updateSubmissionEvaluation);

module.exports = router;