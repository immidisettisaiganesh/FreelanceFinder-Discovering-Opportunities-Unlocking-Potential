const expressAsyncHandler = require("express-async-handler");
const { SubmissionController } = require("../http/controllers/submission.controller");
const { authorize } = require("../http/middlewares/permission.guard");
const { ROLES } = require("../../utils/constants");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const router = require("express").Router();

router.post("/submit", authorize(ROLES.FREELANCER), upload.single("file"), expressAsyncHandler(SubmissionController.submitWork));
router.get("/project/:projectId", expressAsyncHandler(SubmissionController.getSubmissionByProject));
router.patch("/review/:id", authorize(ROLES.OWNER, ROLES.ADMIN), expressAsyncHandler(SubmissionController.reviewSubmission));
router.get("/my", authorize(ROLES.FREELANCER), expressAsyncHandler(SubmissionController.getMySubmissions));

module.exports = { submissionRoutes: router };
