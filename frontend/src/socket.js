import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket"], // force stable connection
  auth: {
    token: localStorage.getItem("token")
  }
});

export default socket;


/* 
    Socket.IO is a separate connection from Axios
    Axios sends token via headers
    Socket must send token explicitly

    Without this - Backend says: someone connected but I don't know who!
*/