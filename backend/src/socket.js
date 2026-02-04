import { Server } from "socket.io";

let io;

// keep list of online users in memory
const onlineUsers = new Map();

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // When user connects mark - online
    // Meaning: userId saved as online
    // shows onlineUsers list to everyone
    socket.on("setup", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      socket.join(userId); // personal room

      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    // here we join chat room
    socket.on("join-chat", (chatId) => {
      if (!chatId) return;
      socket.join(chatId);
      console.log(`here ${socket.id} joined chat ${chatId}`);
    });

    // typing indicator
    socket.on("typing", ({ chatId, username }) => {
      socket.to(chatId).emit("typing", {chatId, username});
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("stopTyping", {chatId});
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
