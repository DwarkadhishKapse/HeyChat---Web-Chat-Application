import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  transports: ["websocket"], // stable on Render
  auth: {
    token: localStorage.getItem("token"),
  },
});

export default socket;


/* 
    Socket.IO is a separate connection from Axios
    Axios sends token via headers
    Socket must send token explicitly

    Without this - Backend says: someone connected but I don't know who!
*/