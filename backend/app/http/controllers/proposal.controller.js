const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const { ProposalModel } = require("../../models/proposal");
const { addProposalSchema } = require("../validators/proposal.schema");
const { ProjectModel } = require("../../models/project");
const { NotificationModel } = require("../../models/notification");
const { copyObject } = require("../../../utils/functions");
const { ROLES } = require("../../../utils/constants");

class ProposalController extends Controller {
  async addNewProposal(req, res) {
    const userId = req.user._id;
    await addProposalSchema.validateAsync(req.body);
    const { description, price, duration, projectId } = req.body;

    const project = await ProjectModel.findById(projectId);
    if (!project) throw createHttpError.NotFound("Project not found.");
    if (project.status !== "OPEN") throw createHttpError.BadRequest("This project is not open for proposals.");

    const existing = await ProposalModel.findOne({ user: userId, project: projectId });
    if (existing) throw createHttpError.BadRequest("You have already submitted a proposal for this project.");

    const proposal = await ProposalModel.create({
      description, price, duration,
      user: userId,
      project: projectId,
    });

    await ProjectModel.updateOne({ _id: projectId }, { $push: { proposals: proposal._id } });

    // Notify owner
    const io = req.app.get("io");
    if (io) {
      await NotificationModel.create({
        user: project.owner,
        title: "New Proposal Received",
        message: `${req.user.name} submitted a proposal for "${project.title}"`,
        type: "bid",
      });
      io.to(project.owner.toString()).emit("receiveNotification", {
        title: "New Proposal!",
        message: `${req.user.name} bid $${price} on "${project.title}"`,
      });
    }

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: { message: "Proposal submitted successfully." },
    });
  }

  async getListOfProposals(req, res) {
    const user = req.user;
    let dbQuery = {};
    if (user.role !== ROLES.ADMIN) dbQuery["user"] = user._id;

    const { sort } = req.query;
    const sortQuery = sort === "latest" ? { createdAt: -1 } : { createdAt: 1 };

    const proposals = await ProposalModel.find(dbQuery)
      .populate("project", "title status")
      .sort(sortQuery);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { proposals },
    });
  }

  async getProposalById(req, res) {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw createHttpError.BadRequest("Invalid proposal ID.");
    const proposal = await ProposalModel.findById(id);
    if (!proposal) throw createHttpError.NotFound("Proposal not found.");
    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { proposal } });
  }

  async changeProposalStatus(req, res) {
    const { id } = req.params;
    let { status, projectId } = req.body;
    status = Number(status);

    const proposal = await ProposalModel.findOneAndUpdate(
      { _id: id },
      { $set: { status } }
    );
    if (!proposal) throw createHttpError.InternalServerError("Failed to update proposal.");

    let freelancer = copyObject(proposal).user;
    if (status !== 2) freelancer = null;

    await ProjectModel.updateOne({ _id: projectId }, { $set: { freelancer } });

    // Reject all other pending proposals if one is accepted
    if (status === 2) {
      await ProposalModel.updateMany(
        { _id: { $ne: id }, project: projectId, status: 1 },
        { $set: { status: 0 } }
      );
    }

    // Notify freelancer
    const io = req.app.get("io");
    if (io) {
      const project = await ProjectModel.findById(projectId);
      const msg = status === 2
        ? `Your proposal for "${project?.title}" was accepted! 🎉`
        : `Your proposal for "${project?.title}" was rejected.`;
      await NotificationModel.create({
        user: proposal.user,
        title: status === 2 ? "Proposal Accepted! 🎉" : "Proposal Rejected",
        message: msg,
        type: "bid",
      });
      io.to(proposal.user.toString()).emit("receiveNotification", {
        title: status === 2 ? "Proposal Accepted!" : "Proposal Rejected",
        message: msg,
      });
    }

    const messages = {
      0: "Proposal rejected.",
      1: "Proposal set to pending.",
      2: "Proposal accepted. Freelancer hired!",
    };

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { message: messages[status] },
    });
  }
}

module.exports = { ProposalController: new ProposalController() };
