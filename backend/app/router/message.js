const expressAsyncHandler = require("express-async-handler");
const { MessageController } = require("../http/controllers/message.controller");
const router = require("express").Router();

router.get("/conversation/:userId", expressAsyncHandler(MessageController.getConversation));
router.get("/conversations", expressAsyncHandler(MessageController.getAllConversations));
router.post("/send", expressAsyncHandler(MessageController.sendMessage));
router.patch("/read/:senderId", expressAsyncHandler(MessageController.markAsRead));

module.exports = { messageRoutes: router };
