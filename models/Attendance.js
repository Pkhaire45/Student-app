const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    // 🔐 Multi-tenant isolation
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },

    // 🎓 Student reference
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true
    },

    // 🏫 Batch reference (CRITICAL for real apps)
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true
    },

    // 📅 Attendance date (one per day)
    date: {
      type: Date,
      required: true
    },

    // ✅ Status
    isPresent: {
      type: Boolean,
      default: false
    },

    // 📝 Optional remark
    remark: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);
