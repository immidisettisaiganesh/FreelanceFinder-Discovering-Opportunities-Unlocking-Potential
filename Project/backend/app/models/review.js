const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ReviewSchema = new mongoose.Schema(
  {
    project: { type: ObjectId, ref: "Project", required: true },
    reviewer: { type: ObjectId, ref: "User", required: true },
    reviewee: { type: ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = { ReviewModel: mongoose.model("Review", ReviewSchema) };
