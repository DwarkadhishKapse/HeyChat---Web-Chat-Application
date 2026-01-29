import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // here we join chat room
    socket.on("join-chat", (chatId) => {
      if (!chatId) return;
      socket.join(chatId);
      console.log(`here ${socket.id} joined chat ${chatId}`);
    });

    // typing indicator
    socket.on("typing", ({ chatId }) => {
      socket.to(chatId).emit("typing");
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("stopTyping");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;
