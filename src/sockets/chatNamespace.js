import * as StandardMessage from '../Models/ModelStandardMessage.js';

const initChat = (io) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    console.log("Nuevo cliente conectado al chat");

    // Manejo de la recepción de mensajes
    socket.on("SEND_MESSAGE", async (msg) => {
      try {
        console.log("Mensaje de chat recibido:", msg);
        const data = {
          chatId:msg.chatId,
          userId: msg.senderUserId,
          touserId:msg.recipientId,
          message: msg.messageContent
        }
    
        const savedMessage = await StandardMessage.createStandardMessage(data);
        
        chatNamespace.emit("message", msg); 
      } catch (error) {
        console.error("Error al guardar el mensaje:", error);
      }
    });

    // Manejo de desconexión de clientes
    socket.on("disconnect", () => {
      console.log("Cliente desconectado del chat");
    });
  });
};

export default initChat;
