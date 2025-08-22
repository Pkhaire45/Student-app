const db = require('../models');
const Submission = db.Submission; 

// Submit Assignment (POST)
const submitAssignment = async (req, res) => {
  try {
    const { assignment_id, student_id } = req.body; // or get from req.user if authenticated
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const submitted_files = req.files.map(file => ({
      file_name: file.originalname,
      file_url: `/uploads/submissions/${file.filename}`,
      file_type: file.mimetype,
      file_size: file.size
    }));
    const submission = await Submission.create({
      assignment_id,
      student_id,
      submitted_files,
      submission_time: new Date()
    });
    return res.status(201).json({ message: 'Submission successful', submission });
  } catch (error) {
    console.error('Submit assignment error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all submissions for an assignment (GET)
const getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      where: { assignment_id: req.params.assignment_id },
      include: [
        {
          model: db.User,
          attributes: ['id', 'fullName', 'username', 'email']
        }
      ]
    });
    // Attach user name to each submission
    const submissionsWithUser = submissions.map(sub => ({
      ...sub.toJSON(),
      userName: sub.User ? sub.User.fullName : null
    }));
    return res.status(200).json({ submissions: submissionsWithUser });
  } catch (error) {
    console.error('Get submissions by assignment error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get submission by student for an assignment
const getSubmissionByStudent = async (req, res) => {
  try {
    const { assignment_id, student_id } = req.params;
    const submission = await Submission.findOne({
      where: { assignment_id, student_id }
    });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    return res.status(200).json({ submission });
  } catch (error) {
    console.error('Get submission by student error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update submission marks/feedback (PUT)
const updateSubmissionEvaluation = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    await submission.update({
      marks_obtained: req.body.marks_obtained,
      feedback: req.body.feedback
    });
    return res.status(200).json({ message: 'Submission evaluated', submission });
  } catch (error) {
    console.error('Evaluate submission error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitAssignment,
  getSubmissionsByAssignment,
  getSubmissionByStudent,
  updateSubmissionEvaluation
};
