const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["bid", "message", "project", "submission", "review", "admin", "general"],
      default: "general",
    },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = { NotificationModel: mongoose.model("Notification", NotificationSchema) };
