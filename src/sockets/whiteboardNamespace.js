const initWhiteboard = (io) => {
    const whiteboardNamespace = io.of("/whiteboard");
  

    whiteboardNamespace.on("connection", (socket) => {
      console.log("Nuevo cliente conectado a la pizarra");
  
      socket.on("audioFileOpened", (file) => {
        console.log("FILE:" + JSON.stringify(file.name));
        whiteboardNamespace.emit("audioFileOpened", file);
      });
  
      socket.on("clear", () => {
        console.log("Pizarra limpiada");
        whiteboardNamespace.emit("clear");
      });
  
      socket.on("disconnect", () => {
        console.log("Cliente desconectado de la pizarra");
      });
    });
  };
  
  export default initWhiteboard;
  