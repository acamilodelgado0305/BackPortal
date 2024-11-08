// whiteboardEvents.js
const events = { 
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    JOIN_ROOM: 'joinRoom',
    AUDIOFILE_OPENED: 'audioFileOpened',
    IMAGE_BOARD:'imageBoard',
    MOVE_IMAGE:'moveImage',
    CHANGE_COLOR:'changeColor',
    CHANGE_LINE_WIDTH:'changeLineWidth',
    MOUSE_MOVE_DRAW:'mouseMoveDraw',
    MOUSE_MOVE_ERASE:'mouseMoveErase',
    MOUSE_DOWN:'mouseDown',
    TOGGLE_DRAWING_MODE:'toggleDrawingMode',
    MOUSE_UP:'mouseUp',
    CHANGE_CURRENT_DRAW_TOOL:'changeCurrentDrawTool',
    TOOGLE_TEXT_MODE:'toogleTextMode',
    TEXT_POSITION_INITIALIZED: 'textPositionInitialized',
    CURRENT_TEXT_UPDATED: 'currentTextUpdated',
    TEXT_ADDED: 'textAdded',
    TOOGLE_DRUG_MODE:'toogleDrugMode',
    CLEAR_WHITEBOARD: 'clearWhiteBoard',
    UNDO_BOARD_STATE:'undoBoardState',
    REDO_BOARD_STATE:'redoBoardState',
    GO_TO_NEXT_PAGE:'goToNextPage',
    GO_TO_PREVIOUS_PAGE:'goToPreviousPage',
    TOGGLE_ZOOM_MODE: 'toggleZoomMode', 
    ZOOM_ON_POSITION:'zoomOnPosition'


}
  
  export default events;

  