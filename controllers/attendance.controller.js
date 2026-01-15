const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  const { studentId, batchId, date, isPresent, remark } = req.body;

  await Attendance.updateOne(
    {
      instituteId: req.instituteId,
      studentId,
      batchId,
      date
    },
    {
      $set: { isPresent, remark }
    },
    { upsert: true }
  );

  res.json({ message: "Attendance saved" });
};

exports.getAttendance = async (req, res) => {
  const filter = { instituteId: req.instituteId };

  if (req.query.studentId) {
    filter.studentId = req.query.studentId;
  }

  const records = await Attendance.find(filter);
  res.json(records);
};
