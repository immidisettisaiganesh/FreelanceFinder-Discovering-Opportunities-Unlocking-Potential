const { ReviewModel } = require("../../models/review");
const { UserModel } = require("../../models/user");
const { ProjectModel } = require("../../models/project");
const { NotificationModel } = require("../../models/notification");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const createHttpError = require("http-errors");

const ReviewController = {
  async addReview(req, res) {
    const reviewerId = req.user._id;
    const { projectId, revieweeId, rating, comment } = req.body;
    if (!rating || !comment || !revieweeId || !projectId)
      throw createHttpError.BadRequest("All fields are required.");

    const existing = await ReviewModel.findOne({ project: projectId, reviewer: reviewerId });
    if (existing) throw createHttpError.BadRequest("You have already reviewed this project.");

    const review = await ReviewModel.create({
      project: projectId, reviewer: reviewerId, reviewee: revieweeId, rating, comment,
    });

    // Update reviewee average rating
    const allReviews = await ReviewModel.find({ reviewee: revieweeId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await UserModel.updateOne({ _id: revieweeId }, { $set: { rating: avgRating.toFixed(1), totalReviews: allReviews.length } });

    // Notify reviewee
    const io = req.app.get("io");
    if (io) {
      await NotificationModel.create({
        user: revieweeId,
        title: "New Review ⭐",
        message: `${req.user.name} gave you a ${rating}-star review.`,
        type: "review",
      });
      io.to(revieweeId.toString()).emit("receiveNotification", {
        title: "New Review!", message: `You received a ${rating}-star review.`,
      });
    }

    return res.status(HttpStatus.CREATED).json({ statusCode: HttpStatus.CREATED, data: { message: "Review added.", review } });
  },

  async getUserReviews(req, res) {
    const { userId } = req.params;
    const reviews = await ReviewModel.find({ reviewee: userId })
      .populate("reviewer", "name avatar role")
      .populate("project", "title")
      .sort({ createdAt: -1 });
    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { reviews } });
  },

  async getProjectReviews(req, res) {
    const { projectId } = req.params;
    const reviews = await ReviewModel.find({ project: projectId })
      .populate("reviewer", "name avatar role")
      .populate("reviewee", "name avatar role");
    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { reviews } });
  },
};

module.exports = { ReviewController };
