const expressAsyncHandler = require("express-async-handler");
const { ReviewController } = require("../http/controllers/review.controller");
const { authorize } = require("../http/middlewares/permission.guard");
const { ROLES } = require("../../utils/constants");
const router = require("express").Router();

router.post("/add", authorize(ROLES.OWNER, ROLES.FREELANCER), expressAsyncHandler(ReviewController.addReview));
router.get("/user/:userId", expressAsyncHandler(ReviewController.getUserReviews));
router.get("/project/:projectId", expressAsyncHandler(ReviewController.getProjectReviews));

module.exports = { reviewRoutes: router };
