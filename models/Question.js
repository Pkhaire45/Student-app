const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    optionText: {
      type: String,
      required: true
    },
    optionNumber: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },

    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true
    },

    questionText: {
      type: String,
      required: true
    },

    correctOption: {
      type: Number,
      required: true
    },

    options: {
      type: [optionSchema],
      validate: {
        validator: (v) => v.length >= 2,
        message: "At least 2 options required"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Question", questionSchema);
