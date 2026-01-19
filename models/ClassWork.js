const mongoose = require("mongoose");

const classWorkSchema = new mongoose.Schema(
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

    // 🗓️ Classwork duration
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

    // 📝 Work content
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
      // ref can be Teacher or Admin (polymorphic by design)
    },

    // 📎 Optional attachments (Mongo-native)
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

module.exports = mongoose.model("ClassWork", classWorkSchema);
