// whiteboardNamespace.js

import events from "../enums/whiteboardEvents.js";
import { handleJoinRoom, handleAudioFileOpened, handleDisconnect, handleChangeColor, handleMouseMove, handleMouseDown, handleToggleDrawingMode, handleMouseUp } from '../controllers/whiteboardControler.js';

const initWhiteboard = (io) => {
  const whiteboardNamespace = io.of("/whiteboard");

  console.log('Prueba enums ' + events.CONNECTION);

  whiteboardNamespace.on(events.CONNECTION, (socket) => {
    console.log("Nuevo cliente conectado a la pizarra");

    handleJoinRoom(socket);
    handleAudioFileOpened(socket);
    handleDisconnect(socket); 

    handleChangeColor(socket);
    handleMouseMove(socket);
    handleMouseDown(socket)
    handleToggleDrawingMode(socket);
    handleMouseUp(socket)


  });
};

export default initWhiteboard;
