const initChat = (io) => {
    const chatNamespace = io.of("/chat");
  
    chatNamespace.on("connection", (socket) => {
      console.log("Nuevo cliente conectado al chat");
  
      socket.on("message", (msg) => {
        console.log("Mensaje de chat recibido:", msg);
        chatNamespace.emit("message", msg); 
      });
  
      socket.on("disconnect", () => {
        console.log("Cliente desconectado del chat");
      });
    });
  };
  
  export default initChat;
  