// whiteboardNamespace.js
import events  from "../enums/whiteboardEvents.js";

const initWhiteboard = (io) => {
  const whiteboardNamespace = io.of("/whiteboard");
console.log('Prueba enums '+events.CONNECTION)
  whiteboardNamespace.on(events.CONNECTION, (socket) => {
    console.log("Nuevo cliente conectado a la pizarra");

    socket.on(events.JOIN_ROOM, (room) => {
      console.log(room);
      socket.join(room);
    });


    socket.on(events.AUDIOFILE_OPENED, (fileData) => {
      console.log("FILE:" + JSON.stringify(fileData.name));
      const { room } = fileData;
      socket.emit(events.AUDIOFILE_OPENED, fileData);
      socket.to(room).emit(events.AUDIOFILE_OPENED, fileData); 
    });

    socket.on("clear", () => {
      console.log("Pizarra limpiada");
      whiteboardNamespace.emit("clear");
    });

    socket.on(events.DISCONNECT, () => {
      console.log("Cliente desconectado de la pizarra");
    });
  });
};

export default initWhiteboard;
