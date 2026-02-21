const expressAsyncHandler = require("express-async-handler");
const { NotificationController } = require("../http/controllers/notification.controller");
const router = require("express").Router();

router.get("/", expressAsyncHandler(NotificationController.getMyNotifications));
router.patch("/read/:id", expressAsyncHandler(NotificationController.markAsRead));
router.patch("/read-all", expressAsyncHandler(NotificationController.markAllAsRead));
router.delete("/:id", expressAsyncHandler(NotificationController.deleteNotification));

module.exports = { notificationRoutes: router };
