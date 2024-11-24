import * as ChatStandardSocketController from '../controllers/chatStandardSocketControlller.js'

const initChat = (io) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    console.log("Nuevo cliente conectado al chat");
    ChatStandardSocketController.handleJoinChat(socket);
    ChatStandardSocketController.handleSendMessage(socket);
    ChatStandardSocketController.handleLeaveChat(socket);
    ChatStandardSocketController.handleTypingStatus(socket);
    ChatStandardSocketController.handleUserJoined(socket);
    ChatStandardSocketController.handleUserLeft(socket);
    ChatStandardSocketController.handleChatHistoryRequest(socket);

    socket.on("disconnect", () => {
      console.log("Cliente desconectado del chat");
    });
  });
};

export default initChat;
