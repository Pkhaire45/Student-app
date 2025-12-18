const { ClassWork, Batch, Subject } = require('../models');

/* =========================
   ADD CLASSWORK (ADMIN)
========================= */
exports.addClassWork = async (req, res) => {
  try {
    const { batchId, subjectId, workDate, description } = req.body;
    const createdBy = req.user.id;

    if (!batchId || !subjectId || !workDate || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const batch = await Batch.findByPk(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    const subject = await Subject.findByPk(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const classWork = await ClassWork.create({
      batchId,
      subjectId,
      workDate,
      description,
      createdBy
    });

    res.status(201).json({ message: 'Classwork added', classWork });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* =========================
   UPDATE CLASSWORK (ADMIN)
========================= */
exports.updateClassWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectId, workDate, description } = req.body;

    const classWork = await ClassWork.findByPk(id);
    if (!classWork) return res.status(404).json({ message: 'Classwork not found' });

    await classWork.update({ subjectId, workDate, description });

    res.json({ message: 'Classwork updated', classWork });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* =========================
   DELETE CLASSWORK (ADMIN)
========================= */
exports.deleteClassWork = async (req, res) => {
  try {
    const { id } = req.params;

    const classWork = await ClassWork.findByPk(id);
    if (!classWork) return res.status(404).json({ message: 'Classwork not found' });

    await classWork.destroy();
    res.json({ message: 'Classwork deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* =========================
   GET CLASSWORK BY ID
========================= */
exports.getClassWorkById = async (req, res) => {
  const classWork = await ClassWork.findByPk(req.params.id);
  if (!classWork) return res.status(404).json({ message: 'Not found' });
  res.json(classWork);
};

/* =========================
   GET CLASSWORK BY BATCH
========================= */
exports.getClassWorkByBatch = async (req, res) => {
  const { batchId } = req.params;

  const data = await ClassWork.findAll({
    where: { batchId },
    order: [['workDate', 'DESC']]
  });

  res.json({ total: data.length, classworks: data });
};

/* =========================
   GET CLASSWORK BY BATCH + DATE
========================= */
exports.getClassWorkByBatchAndDate = async (req, res) => {
  const { batchId, date } = req.params;

  const data = await ClassWork.findAll({
    where: { batchId, workDate: date }
  });

  res.json({ total: data.length, classworks: data });
};

/* =========================
   GET CLASSWORK BY SUBJECT
========================= */
exports.getClassWorkBySubject = async (req, res) => {
  const { batchId, subjectId } = req.params;

  const data = await ClassWork.findAll({
    where: { batchId, subjectId }
  });

  res.json({ total: data.length, classworks: data });
};
