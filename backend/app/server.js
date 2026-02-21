const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const createError = require("http-errors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { allRoutes } = require("./router/router");
dotenv.config();

class Application {
  #app = express();
  #PORT = process.env.PORT || 5000;
  #DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sbworks";
  #server;
  #io;

  constructor() {
    this.#server = http.createServer(this.#app);
    this.#io = new Server(this.#server, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.#app.set("io", this.#io);
    this.createServer();
    this.connectToDB();
    this.configServer();
    this.initClientSession();
    this.configRoutes();
    this.configSocket();
    this.errorHandling();
  }

  createServer() {
    this.#server.listen(this.#PORT, () =>
      console.log(`🚀 SB Works server running on port ${this.#PORT}`)
    );
  }

  connectToDB() {
    mongoose
      .connect(this.#DB_URI)
      .then(() => console.log("✅ MongoDB Connected"))
      .catch((err) => console.log("❌ MongoDB connection failed:", err));
  }

  configServer() {
    this.#app.use(
      cors({
        credentials: true,
        origin: ["http://localhost:3000", "http://localhost:5173"],
        methods: ["POST", "GET", "PATCH", "DELETE", "PUT"],
      })
    );
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
  }

  initClientSession() {
    this.#app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));
  }

  configRoutes() {
    this.#app.use("/api", allRoutes);
  }

  configSocket() {
    const onlineUsers = {};
    this.#io.on("connection", (socket) => {
      socket.on("join", (userId) => {
        onlineUsers[userId] = socket.id;
        socket.join(userId);
      });
      socket.on("sendMessage", ({ receiverId, message }) => {
        this.#io.to(receiverId).emit("receiveMessage", message);
      });
      socket.on("sendNotification", ({ receiverId, notification }) => {
        this.#io.to(receiverId).emit("receiveNotification", notification);
      });
      socket.on("disconnect", () => {
        Object.keys(onlineUsers).forEach((key) => {
          if (onlineUsers[key] === socket.id) delete onlineUsers[key];
        });
      });
    });
  }

  errorHandling() {
    this.#app.use((req, res, next) => {
      next(createError.NotFound("Route not found."));
    });
    this.#app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError();
      const statusCode = error.status || serverError.status;
      const message = error.message || serverError.message;
      return res.status(statusCode).json({ statusCode, message });
    });
  }
}

module.exports = Application;
