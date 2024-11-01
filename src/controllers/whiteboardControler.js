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

export const handleDisconnect = (socket) => {
  socket.on(events.DISCONNECT, () => {
    console.log("Cliente desconectado de la pizarra");
  });
};

