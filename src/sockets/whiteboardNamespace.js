// whiteboardNamespace.js

import events from "../enums/whiteboardEvents.js";
import { handleJoinRoom, handleAudioFileOpened,handleImageFileOpened, handleMoveImage,handleDisconnect,
   handleChangeColor, handleChangeLineWidth,handleMouseMoveDraw, handleMouseMoveErase, handleMouseDown,
    handleToggleDrawingMode, handleMouseUp, handleChangeDrawTool, handleChangeTool } from '../controllers/whiteboardControler.js';

const initWhiteboard = (io) => {
  const whiteboardNamespace = io.of("/whiteboard");

  console.log('Prueba enums ' + events.CONNECTION);

  whiteboardNamespace.on(events.CONNECTION, (socket) => {
    console.log("Nuevo cliente conectado a la pizarra");

    handleJoinRoom(socket);
    handleAudioFileOpened(socket);
    handleMouseMoveErase(socket);
    handleDisconnect(socket); 
    handleImageFileOpened(socket);
    handleMoveImage(socket);
    handleChangeColor(socket);
    handleChangeLineWidth(socket);
    handleMouseMoveDraw(socket);
    handleMouseMoveErase(socket);
    handleMouseDown(socket);
    handleToggleDrawingMode(socket);
    handleMouseUp(socket);
    handleChangeDrawTool(socket);
    handleChangeTool(socket);

  });
};

export default initWhiteboard;
