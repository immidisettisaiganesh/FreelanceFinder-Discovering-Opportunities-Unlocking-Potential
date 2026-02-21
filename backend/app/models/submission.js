const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const SubmissionSchema = new mongoose.Schema(
  {
    project: { type: ObjectId, ref: "Project", required: true },
    freelancer: { type: ObjectId, ref: "User", required: true },
    client: { type: ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    fileUrl: { type: String, default: "" },
    fileName: { type: String, default: "" },
    status: {
      type: String,
      enum: ["submitted", "approved", "revision_requested"],
      default: "submitted",
    },
    clientFeedback: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = { SubmissionModel: mongoose.model("Submission", SubmissionSchema) };
