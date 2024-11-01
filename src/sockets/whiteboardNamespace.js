// whiteboardNamespace.js

import events from "../enums/whiteboardEvents.js";
import { handleJoinRoom, handleAudioFileOpened, handleDisconnect } from '../controllers/whiteboardControler.js';

const initWhiteboard = (io) => {
  const whiteboardNamespace = io.of("/whiteboard");

  console.log('Prueba enums ' + events.CONNECTION);

  whiteboardNamespace.on(events.CONNECTION, (socket) => {
    console.log("Nuevo cliente conectado a la pizarra");

    handleJoinRoom(socket);
    handleAudioFileOpened(socket);
    handleDisconnect(socket);
  });
};

export default initWhiteboard;
