const { Assignment } = require('../models');

// Create Assignment (POST)
const createAssignment = async (req, res) => {
  try {
    // Build attachments array from uploaded files
    const attachments = req.files.map(file => ({
      file_name: file.originalname,
      file_url: `/uploads/assignments/${file.filename}`,
      file_type: file.mimetype,
      file_size: file.size
    }));

    // Merge attachments into request body
    const assignmentData = {
      ...req.body,
      attachments
    };

    const assignment = await Assignment.create(assignmentData);
    return res.status(201).json({ message: 'Assignment created!', assignment });
  } catch (error) {
    console.error('Create assignment error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get All Assignments (GET)
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll();
    return res.status(200).json({ assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get Assignment by ID (GET)
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    return res.status(200).json({ assignment });
  } catch (error) {
    console.error('Get assignment by id error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update Assignment (PUT)
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    await assignment.update(req.body);
    return res.status(200).json({ message: 'Assignment updated!', assignment });
  } catch (error) {
    console.error('Update assignment error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment
};