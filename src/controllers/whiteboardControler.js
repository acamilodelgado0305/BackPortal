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
  socket.on('changeColor', (color)=>{
    console.log('socketid' +socket.room )
    socket.to(socket.room).emit('changeColor', color); 
     console.log('Se cambió de color a : ' + color)
  })  
}

export const handleChangeLineWidth = (socket)=>{
  socket.on('changeLineWidth', (value)=>{
    socket.to(socket.room).emit('changeLineWidth', value); 
     console.log('Se cambió el grosor a : ' + value)
  })
}

export const handleMouseMoveDraw = (socket) => {
  socket.on('mouseMoveDraw', (position)=>{
    socket.to(socket.room).emit('mouseMoveDraw', position); 
  }) 
 
}

export const handleMouseMoveErase = (socket) => {
  socket.on('mouseMoveErase', (position)=>{
    socket.to(socket.room).emit('mouseMoveErase', position); 
  }
  )
}

export const handleMouseDown = (socket) =>{
  socket.on('mouseDown', (position)=>{
    socket.to(socket.room).emit('mouseDown', position); 
    console.log('mouseDown position: '+ (position && JSON.stringify(position)))
    }) 
 
}

export const handleToggleDrawingMode = (socket) => {
  socket.on('toggleDrawingMode', ()=>{
    socket.to(socket.room).emit('toggleDrawingMode');   
    console.log('handleToggleDrawingMode')
    })
  
}
export const handleMouseUp = (socket) => {
  socket.on('mouseUp', ()=>{
    socket.to(socket.room).emit('mouseUp'); 
    console.log('handleMouseUp')  
    })
  
}