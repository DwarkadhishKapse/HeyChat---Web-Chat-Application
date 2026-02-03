import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";
import { heyAIUser } from "./utils/heyAIUser.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

//* we import http here, cuz Socket.IO need raw HTTP server
const server = http.createServer(app);

//* Initialize Socket.IO
initSocket(server);

// Start server and connect database
const startServer = async () => {
  try {
    await connectDB();

    await heyAIUser();

    server.listen(PORT, () => {
      console.log(`HeyChat server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
