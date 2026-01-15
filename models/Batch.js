const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },

    batchName: {
      type: String,
      required: true,
      trim: true
    },

    standard: {
      type: String,
      required: true
    },

    stream: {
      type: String
    },

    academicYear: {
      type: String,
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    studentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        index: true
      }
    ],

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batch", batchSchema, "batches"); // ✅ THIS FIXES IT
