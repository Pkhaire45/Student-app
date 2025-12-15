const { Batch, User, StudentBatch, sequelize } = require('../models');

/**
 * =========================
 * CREATE BATCH
 * =========================
 */
exports.createBatch = async (req, res) => {
  try {
    const {
      batchName,
      standard,
      stream,
      academicYear,
      startDate,
      endDate
    } = req.body;

    if (!batchName || !standard || !academicYear || !startDate) {
      return res.status(400).json({
        message: 'Required fields missing'
      });
    }

    const batch = await Batch.create({
      batchName,
      standard,
      stream,
      academicYear,
      startDate,
      endDate
    });

    return res.status(201).json({
      message: 'Batch created successfully',
      batch
    });

  } catch (error) {
    console.error('Create Batch Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};


/**
 * =========================
 * GET ALL BATCHES
 * =========================
 */
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ batches });

  } catch (error) {
    console.error('Get Batches Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};


/**
 * =========================
 * DELETE BATCH
 * =========================
 */
exports.deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    await batch.destroy();

    return res.status(200).json({
      message: 'Batch deleted successfully'
    });

  } catch (error) {
    console.error('Delete Batch Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};


/**
 * =========================
 * ADD STUDENTS TO BATCH
 * =========================
 */
exports.addStudentsToBatch = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { batchId } = req.params;
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'studentIds must be a non-empty array'
      });
    }

    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Validate students
    const students = await User.findAll({
      where: {
        id: studentIds,
        role: 'student'
      }
    });

    if (students.length !== studentIds.length) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'One or more users are not valid students'
      });
    }

    // Prepare bulk insert
    const mappings = studentIds.map((studentId) => ({
      studentId,
      batchId
    }));

    await StudentBatch.bulkCreate(mappings, {
      ignoreDuplicates: true,
      transaction
    });

    await transaction.commit();

    return res.status(200).json({
      message: 'Students added to batch successfully'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Add Students Error:', error);

    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};


/**
 * =========================
 * GET BATCH DETAILS BY ID
 * =========================
 */
exports.getBatchDetailsById = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findByPk(batchId, {
      include: [
        {
          model: User,
          attributes: [
            'id',
            'fullName',
            'username',
            'email',
            'standard',
            'stream'
          ],
          through: {
            attributes: ['joinedAt']
          },
          where: { role: 'student' },
          required: false
        }
      ]
    });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    return res.status(200).json({ batch });

  } catch (error) {
    console.error('Get Batch Details Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};
