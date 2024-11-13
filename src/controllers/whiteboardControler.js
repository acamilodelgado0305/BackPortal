// controllers/whiteboardController.js

import events from "../enums/whiteboardEvents.js";

export const handleJoinRoom = (socket) => {
  socket.on(events.JOIN_ROOM, (room) => {
    socket.join(room);
    socket.room = room;
  });
};

export const handleAudioFileOpened = (socket) => {
  socket.on(events.AUDIOFILE_OPENED, (fileData) => {
    socket.emit(events.AUDIOFILE_OPENED, fileData);
    socket.to(socket.room).emit(events.AUDIOFILE_OPENED, fileData); 
  });
};

export const handleImageFileOpened = (socket) =>{
  socket.on(events.IMAGE_BOARD, (data)=>{ 
    socket.to(socket.room).emit(events.IMAGE_BOARD, data)
    console.log('Imagen subida a la pizarra ')

  })
}

export const handleMoveImage = (socket) =>{
  socket.on(events.MOVE_IMAGE, (data) => {
  socket.to(socket.room).emit(events.IMAGE_BOARD, data);
  console.log('Moviendo imagen de la pizzarra a la pizarra '+JSON.stringify(data))
  })
}

export const handleDisconnect = (socket) => {
  socket.on(events.DISCONNECT, () => {
    console.log("Cliente desconectado de la pizarra");
  });
};

export const handleChangeColor = (socket) => {
  socket.on(events.CHANGE_COLOR, (color)=>{
    socket.to(socket.room).emit(events.CHANGE_COLOR, color); 
  })  
}

export const handleChangeLineWidth = (socket)=>{
  socket.on(events.CHANGE_LINE_WIDTH, (value)=>{
    socket.to(socket.room).emit(events.CHANGE_LINE_WIDTH, value); 
  })
}

export const handleMouseMoveDraw = (socket) => {
  socket.on(  events.MOUSE_MOVE_DRAW, (position)=>{
    socket.to(socket.room).emit( events.MOUSE_MOVE_DRAW, position); 
  }) 
 
}

export const handleMouseMoveErase = (socket) => {
  socket.on(events.MOUSE_MOVE_ERASE, (position)=>{
    socket.to(socket.room).emit(events.MOUSE_MOVE_ERASE, position); 
  }
  )
}

export const handleMouseDown = (socket) =>{
  socket.on(events.MOUSE_DOWN, (position)=>{
    socket.to(socket.room).emit( events.MOUSE_DOWN, position); 
    console.log('mouseDown position: '+ (position && JSON.stringify(position)))
    }) 
 
}

export const handleToggleDrawingMode = (socket) => {
  socket.on(events.TOGGLE_DRAWING_MODE, (payload)=>{
    socket.to(socket.room).emit(events.TOGGLE_DRAWING_MODE, payload);   
    })
  
}
export const handleMouseUp = (socket) => {
  socket.on(events.MOUSE_UP, ()=>{
    socket.to(socket.room).emit(events.MOUSE_UP); 
    })
}

  
export const handleChangeDrawTool = (socket) => {
  socket.on(events.CHANGE_CURRENT_DRAW_TOOL, (payload)=>{
    socket.to(socket.room).emit(events.CHANGE_CURRENT_DRAW_TOOL, payload);  
    console.log('Cambio la forma '+JSON.stringify(payload))
  })
}

export const handleChangeTool = (socket) =>{
  socket.on(events.TOOGLE_TEXT_MODE, ()=>{
    socket.to(socket.room).emit(events.TOOGLE_TEXT_MODE); 
  })
}

export const handleInitializeTextPosition = (socket)=>{
  socket.on(events.TEXT_POSITION_INITIALIZED, (position)=>{
    socket.to(socket.room).emit(events.TEXT_POSITION_INITIALIZED, position); 
  })
}


export const handleUpdateCurrentText = (socket) =>{
  socket.on(events.CURRENT_TEXT_UPDATED, (text)=>{
    socket.to(socket.room).emit(events.CURRENT_TEXT_UPDATED, text); 
  })
}

export const handleAddTextToList = (socket) =>{
  socket.on(events.TEXT_ADDED, ()=>{
    socket.to(socket.room).emit(events.TEXT_ADDED); 
  })
}

export const handleToogleDrugMode = (socket) =>{
  socket.on(events.TOOGLE_DRUG_MODE, ()=>{
    socket.to(socket.room).emit(events.TOOGLE_DRUG_MODE); 
  })
}

export const handleClearWhieBoard = (socket) => {
  socket.on(events.CLEAR_WHITEBOARD, ()=> {
    socket.to(socket.room).emit(events.CLEAR_WHITEBOARD); 
  })
}

export const handleUndoBoardState = (socket)=>{
  socket.on(events.UNDO_BOARD_STATE, ()=>{
    socket.to(socket.room).emit(events.UNDO_BOARD_STATE); 
  })
} 

export const handleRedoBoardState = (socket)=>{
  socket.on(events.REDO_BOARD_STATE, ()=>{
    socket.to(socket.room).emit(events.REDO_BOARD_STATE); 
  })
} 

export const handleGoToNextPage = (socket) => {
  socket.on(events.GO_TO_NEXT_PAGE, ()=>{
    socket.to(socket.room).emit(events.GO_TO_NEXT_PAGE); 
  })
}

export const handleGoToPreviousPage = (socket) => {
  socket.on(events.GO_TO_PREVIOUS_PAGE, ()=>{
    socket.to(socket.room).emit(events.GO_TO_PREVIOUS_PAGE); 
  })
}

export const handleToggleZoomMode = (socket) =>{
  socket.on(events.TOGGLE_ZOOM_MODE, ()=>{
    socket.to(socket.room).emit(events.TOGGLE_ZOOM_MODE); 
  })
}

export const handleZoomOnPosition = (socket) => {
  socket.on(events.ZOOM_ON_POSITION, (data)=>{
    socket.to(socket.room).emit(events.ZOOM_ON_POSITION, data); 
  })
}
