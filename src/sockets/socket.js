// socket.js
import { Server } from "socket.io";
import { initWhiteboard, initChat } from "./index.js";

const setupWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.FRONT_DEV, process.env.FRONT_PROD],
      methods: ["GET", "POST"],
    }
  });

  initWhiteboard(io);
  initChat(io);
}

export default setupWebSocket;
