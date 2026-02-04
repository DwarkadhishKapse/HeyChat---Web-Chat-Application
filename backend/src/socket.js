import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

// keep list of online users in memory
const onlineUsers = new Map();

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL?.split(","),
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, "User:", socket.userId);

    // When user connects mark - online
    // Meaning: userId saved as online
    // shows onlineUsers list to everyone
    onlineUsers.set(socket.userId, socket.id);
    socket.join(socket.userId); // personal room

    io.emit("online-users", Array.from(onlineUsers.keys()));

    // here we join chat room
    socket.on("join-chat", (chatId) => {
      if (!chatId) return;
      socket.join(chatId);
      console.log(`here ${socket.id} joined chat ${chatId}`);
    });

    // typing indicator
    socket.on("typing", ({ chatId, username }) => {
      socket.to(chatId).emit("typing", { chatId, username });
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("stopTyping", { chatId });
    });

    // If disconnect - remove user from onlineUsers list and anyone can see it
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("online-users", Array.from(onlineUsers.keys()));
      }
    });
  });

  return io;
};

export const getIO = () => io;
