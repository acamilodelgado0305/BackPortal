
import events from "../enums/whiteboardEvents.js";
import * as whiteboardController from '../controllers/whiteboardControler.js';


const initWhiteboard = (io) => {
  const whiteboardNamespace = io.of("/whiteboard");

  
  whiteboardNamespace.on(events.CONNECTION, (socket) => {
    console.log("Nuevo cliente conectado a la pizarra");

    whiteboardController.handleJoinRoom(socket);
    whiteboardController.handleAudioFileOpened(socket);
    whiteboardController.handleMouseMoveErase(socket);
    whiteboardController.handleDisconnect(socket); 
    whiteboardController.handleImageFileOpened(socket);
    whiteboardController.handleMoveImage(socket);
    whiteboardController.handleChangeColor(socket);
    whiteboardController.handleChangeLineWidth(socket);
    whiteboardController.handleMouseMoveDraw(socket);
    whiteboardController.handleMouseMoveErase(socket);
    whiteboardController.handleMouseDown(socket);
    whiteboardController.handleToggleDrawingMode(socket);
    whiteboardController.handleMouseUp(socket);
    whiteboardController.handleChangeDrawTool(socket);
    whiteboardController.handleChangeTool(socket);
    whiteboardController.handleInitializeTextPosition(socket);
    whiteboardController.handleUpdateCurrentText(socket);
    whiteboardController.handleAddTextToList(socket);
    whiteboardController.handleToogleDrugMode(socket);
    whiteboardController.handleClearWhieBoard(socket);
    whiteboardController.handleUndoBoardState(socket);
    whiteboardController.handleRedoBoardState(socket);
    whiteboardController.handleGoToNextPage(socket);
    whiteboardController.handleGoToPreviousPage(socket);
    whiteboardController.handleToggleZoomMode(socket);
    whiteboardController.handleZoomOnPosition(socket);

  });
};

export default initWhiteboard;
