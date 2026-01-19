const mongoose = require("mongoose");

const homeWorkSchema = new mongoose.Schema(
  {
    // 🔐 Multi-tenant isolation
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },

    // 🏫 Batch reference
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true
    },

    // 🗓️ Homework duration
    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    // 🕒 Backward compatibility (optional)
    workDate: {
      type: Date
    },

    // 📝 Homework content
    description: {
      type: String,
      required: true,
      trim: true
    },

    // 🧑‍🏫 Created by (Teacher / Admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
      // ref intentionally flexible (Teacher/Admin)
    },

    // 📎 Optional attachments (future-proof)
    attachments: [
      {
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("HomeWork", homeWorkSchema);
