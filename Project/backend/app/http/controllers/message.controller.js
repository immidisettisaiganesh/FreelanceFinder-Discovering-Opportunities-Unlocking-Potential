const { MessageModel } = require("../../models/message");
const { NotificationModel } = require("../../models/notification");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const mongoose = require("mongoose");

const MessageController = {
  async sendMessage(req, res) {
    const senderId = req.user._id;
    const { receiverId, content, projectId } = req.body;
    if (!content || !receiverId) throw new Error("Receiver and content required.");

    const message = await MessageModel.create({
      sender: senderId,
      receiver: receiverId,
      content,
      project: projectId || null,
    });

    const populated = await MessageModel.findById(message._id)
      .populate("sender", "name avatar role")
      .populate("receiver", "name avatar role");

    // Real-time via socket
    const io = req.app.get("io");
    if (io) {
      io.to(receiverId.toString()).emit("receiveMessage", populated);
      // Create notification
      await NotificationModel.create({
        user: receiverId,
        title: "New Message",
        message: `You have a new message from ${req.user.name}`,
        type: "message",
      });
      io.to(receiverId.toString()).emit("receiveNotification", {
        title: "New Message",
        message: `You have a new message from ${req.user.name}`,
      });
    }

    return res.status(HttpStatus.CREATED).json({ statusCode: HttpStatus.CREATED, data: { message: populated } });
  },

  async getConversation(req, res) {
    const userId = req.user._id;
    const { userId: otherId } = req.params;
    const messages = await MessageModel.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId },
      ],
    })
      .populate("sender", "name avatar role")
      .populate("receiver", "name avatar role")
      .sort({ createdAt: 1 });

    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { messages } });
  },

  async getAllConversations(req, res) {
    const userId = req.user._id;
    const messages = await MessageModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name avatar role")
      .populate("receiver", "name avatar role")
      .sort({ createdAt: -1 });

    // Group by conversation partner
    const conversations = {};
    messages.forEach((msg) => {
      const partner = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
      const pid = partner._id.toString();
      if (!conversations[pid]) {
        conversations[pid] = { partner, lastMessage: msg, unread: 0 };
      }
      if (!msg.isRead && msg.receiver._id.toString() === userId.toString()) {
        conversations[pid].unread++;
      }
    });

    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { conversations: Object.values(conversations) } });
  },

  async markAsRead(req, res) {
    const userId = req.user._id;
    const { senderId } = req.params;
    await MessageModel.updateMany({ sender: senderId, receiver: userId }, { $set: { isRead: true } });
    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { message: "Messages marked as read." } });
  },
};

module.exports = { MessageController };
