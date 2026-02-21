const { SubmissionModel } = require("../../models/submission");
const { ProjectModel } = require("../../models/project");
const { NotificationModel } = require("../../models/notification");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const createHttpError = require("http-errors");

const SubmissionController = {
  async submitWork(req, res) {
    const freelancerId = req.user._id;
    const { projectId, description } = req.body;

    const project = await ProjectModel.findById(projectId);
    if (!project) throw createHttpError.NotFound("Project not found.");
    if (project.freelancer?.toString() !== freelancerId.toString())
      throw createHttpError.Forbidden("You are not assigned to this project.");

    const existing = await SubmissionModel.findOne({ project: projectId, freelancer: freelancerId });
    let submission;
    if (existing) {
      existing.description = description;
      existing.status = "submitted";
      if (req.file) { existing.fileUrl = `/uploads/${req.file.filename}`; existing.fileName = req.file.originalname; }
      await existing.save();
      submission = existing;
    } else {
      submission = await SubmissionModel.create({
        project: projectId,
        freelancer: freelancerId,
        client: project.owner,
        description,
        fileUrl: req.file ? `/uploads/${req.file.filename}` : "",
        fileName: req.file ? req.file.originalname : "",
      });
    }

    // Notify client
    const io = req.app.get("io");
    if (io) {
      await NotificationModel.create({
        user: project.owner,
        title: "Work Submitted",
        message: `Freelancer submitted work for project: ${project.title}`,
        type: "submission",
      });
      io.to(project.owner.toString()).emit("receiveNotification", {
        title: "Work Submitted",
        message: `Freelancer submitted work for "${project.title}"`,
      });
    }

    return res.status(HttpStatus.CREATED).json({ statusCode: HttpStatus.CREATED, data: { message: "Work submitted successfully.", submission } });
  },

  async getSubmissionByProject(req, res) {
    const { projectId } = req.params;
    const submission = await SubmissionModel.findOne({ project: projectId })
      .populate("freelancer", "name avatar")
      .populate("client", "name avatar")
      .populate("project", "title");

    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { submission } });
  },

  async reviewSubmission(req, res) {
    const { id } = req.params;
    const { status, clientFeedback } = req.body;

    const submission = await SubmissionModel.findByIdAndUpdate(
      id,
      { $set: { status, clientFeedback } },
      { new: true }
    ).populate("project");

    if (!submission) throw createHttpError.NotFound("Submission not found.");

    if (status === "approved") {
      await ProjectModel.updateOne({ _id: submission.project._id }, { $set: { status: "CLOSED" } });
    }

    // Notify freelancer
    const io = req.app.get("io");
    if (io) {
      await NotificationModel.create({
        user: submission.freelancer,
        title: status === "approved" ? "Work Approved! 🎉" : "Revision Requested",
        message: clientFeedback || `Your submission for "${submission.project.title}" was ${status}.`,
        type: "submission",
      });
      io.to(submission.freelancer.toString()).emit("receiveNotification", {
        title: status === "approved" ? "Work Approved!" : "Revision Requested",
        message: clientFeedback,
      });
    }

    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { message: "Submission reviewed.", submission } });
  },

  async getMySubmissions(req, res) {
    const freelancerId = req.user._id;
    const submissions = await SubmissionModel.find({ freelancer: freelancerId })
      .populate("project", "title status")
      .populate("client", "name avatar")
      .sort({ createdAt: -1 });
    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { submissions } });
  },
};

module.exports = { SubmissionController };
