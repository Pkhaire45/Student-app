const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true
    },
    selectedOption: {
      type: Number,
      required: true
    },
    answeredAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// 🔥 THIS LINE WAS MISSING
module.exports = mongoose.model("TestAttempt", testAttemptSchema);
