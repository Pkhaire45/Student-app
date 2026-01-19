const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true
    },

    testTitle: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    subject: {
      type: String,
      required: true
    },

    standard: {
      type: String // renamed from `class` (JS keyword safety)
    },

    duration: {
      type: Number, // minutes
      required: true
    },

    testType: {
      type: String, // MCQ, Unit Test
      required: true,
      enum: ["MCQ", "Unit Test"]
    },

    dueDate: {
      type: Date
    },

    dueTime: {
      type: String // HH:mm
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Test", testSchema);
