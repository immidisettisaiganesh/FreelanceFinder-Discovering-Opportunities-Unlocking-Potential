const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
// const { uploadFile } = require("../../utils/multer");
const { verifyAccessToken } = require("../http/middlewares/user.middleware");
const { getOtp, checkOtp, completeProfile, refreshToken, updateProfile, getUserProfile, logout } = require("../http/controllers/userAuth.controller");

router.post("/get-otp", expressAsyncHandler(getOtp));
router.post("/check-otp", expressAsyncHandler(checkOtp));
router.post("/complete-profile", verifyAccessToken, expressAsyncHandler(completeProfile));
router.get("/refresh-token", expressAsyncHandler(refreshToken));
router.patch("/update", verifyAccessToken, expressAsyncHandler(updateProfile));
router.get("/profile", verifyAccessToken, expressAsyncHandler(getUserProfile));
router.post("/logout", expressAsyncHandler(logout));

module.exports = {
  userAuthRoutes: router,
};

