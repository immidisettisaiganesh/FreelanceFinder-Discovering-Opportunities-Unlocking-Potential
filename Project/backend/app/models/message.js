const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: ObjectId, ref: "User", required: true },
    receiver: { type: ObjectId, ref: "User", required: true },
    project: { type: ObjectId, ref: "Project", default: null },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    fileUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = { MessageModel: mongoose.model("Message", MessageSchema) };
