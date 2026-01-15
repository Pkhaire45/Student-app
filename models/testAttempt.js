const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema(
  {
    // 🔐 Multi-tenant isolation
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },

    // 🎓 Student
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true
    },

    // 🧪 Test
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true
    },

    // ❓ Question
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true
    },

    // 🅰️ Selected option number
    selectedOption: {
      type: Number,
      required: true
    },

    // ⏱️ When answer was submitted
    answeredAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);
