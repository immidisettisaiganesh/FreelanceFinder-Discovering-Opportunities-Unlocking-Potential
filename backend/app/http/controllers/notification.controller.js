const { NotificationModel } = require("../../models/notification");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const NotificationController = {
  async getMyNotifications(req, res) {
    const userId = req.user._id;
    const notifications = await NotificationModel.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await NotificationModel.countDocuments({ user: userId, isRead: false });
    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { notifications, unreadCount } });
  },
  async markAsRead(req, res) {
    await NotificationModel.findByIdAndUpdate(req.params.id, { $set: { isRead: true } });
    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { message: "Marked as read." } });
  },
  async markAllAsRead(req, res) {
    await NotificationModel.updateMany({ user: req.user._id }, { $set: { isRead: true } });
    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { message: "All marked as read." } });
  },
  async deleteNotification(req, res) {
    await NotificationModel.findByIdAndDelete(req.params.id);
    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { message: "Deleted." } });
  },
};

module.exports = { NotificationController };
