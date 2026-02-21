const { authorize } = require("../http/middlewares/permission.guard");
const { verifyAccessToken, isVerifiedUser } = require("../http/middlewares/user.middleware");
const { adminRoutes } = require("./admin/admin.routes");
const { categoryRoutes } = require("./category");
const { projectRoutes } = require("./project");
const { proposalRoutes } = require("./proposal");
const { userAuthRoutes } = require("./userAuth");
const { messageRoutes } = require("./message");
const { submissionRoutes } = require("./submission");
const { reviewRoutes } = require("./review");
const { notificationRoutes } = require("./notification");
const { ROLES } = require("../../utils/constants");

const router = require("express").Router();

router.use("/user", userAuthRoutes);
router.use("/category", categoryRoutes);
router.use("/project", verifyAccessToken, isVerifiedUser, projectRoutes);
router.use("/proposal", verifyAccessToken, isVerifiedUser, proposalRoutes);
router.use("/message", verifyAccessToken, isVerifiedUser, messageRoutes);
router.use("/submission", verifyAccessToken, isVerifiedUser, submissionRoutes);
router.use("/review", verifyAccessToken, isVerifiedUser, reviewRoutes);
router.use("/notification", verifyAccessToken, isVerifiedUser, notificationRoutes);
router.use("/admin", verifyAccessToken, isVerifiedUser, authorize(ROLES.ADMIN), adminRoutes);

module.exports = { allRoutes: router };
