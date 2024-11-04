// controllers/whiteboardController.js

import events from "../enums/whiteboardEvents.js";

export const handleJoinRoom = (socket) => {
  socket.on(events.JOIN_ROOM, (room) => {
    console.log(room);
    socket.join(room);
  });
};

export const handleAudioFileOpened = (socket) => {
  socket.on(events.AUDIOFILE_OPENED, (fileData) => {
    const { room } = fileData;

    socket.emit(events.AUDIOFILE_OPENED, fileData);
    socket.to(room).emit(events.AUDIOFILE_OPENED, fileData); 
  });
};

export const handleImageFileOpened = (socket) =>{
  socket.on(events.IMAGE_BOARD, (data)=>{ 
    const { room } = data;
    socket.to(room).emit(events.IMAGE_BOARD, data)
    console.log('Imagen subida a la pizarra ')

  })
}

export const handleMoveImage = (socket) =>{
  socket.on(events.MOVE_IMAGE, (data) => {
  const { room } = data;
  socket.to(room).emit(events.IMAGE_BOARD, data)
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
    socket.to('1').emit('changeColor', color); 
     console.log('Se cambió de color a : ' + color)

  })  
  
}
export const handleMouseMoveDraw = (socket) => {
  socket.on('mouseMoveDraw', (position)=>{
    socket.to('1').emit('mouseMoveDraw', position); 
  }) 
 
}

export const handleMouseMoveErase = (socket) => {
  socket.on('mouseMoveErase', (position)=>{
    socket.to('1').emit('mouseMoveErase', position); 
  }
  )
}

export const handleMouseDown = (socket) =>{
  socket.on('mouseDown', (position)=>{
    socket.to('1').emit('mouseDown', position); 
    console.log('mouseDown position: '+ (position && JSON.stringify(position)))
    }) 
 
}

export const handleToggleDrawingMode = (socket) => {
  socket.on('toggleDrawingMode', ()=>{
    socket.to('1').emit('toggleDrawingMode');   
    console.log('handleToggleDrawingMode')
    })
  
}
export const handleMouseUp = (socket) => {
  socket.on('mouseUp', ()=>{
    socket.to('1').emit('mouseUp'); 
    console.log('handleMouseUp')  
    })
  
}