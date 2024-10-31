import { Server } from "socket.io";
import initChat from "./chatNamespace.js";
import initWhiteboard from "./whiteboardNamespace.js";

const initSocketServer = (httpServer) => {
  const io = new Server(httpServer);

  initChat(io);
  initWhiteboard(io);

  return io; 
};

export default initSocketServer;
