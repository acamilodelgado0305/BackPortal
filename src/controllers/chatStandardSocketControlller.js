import * as StandardMessage from "../Models/ModelStandardMessage.js";
import { events } from "../enums/standardChatsEvents.js";


export const handleJoinChat = (socket) => {
    socket.on(events.JOIN_CHAT, (payload) => {
        socket.chatId = payload;
        console.log(`Usuario con ID  se unió al chat ${payload}`);
    });
};
export const handleSendMessage = (socket) => {
    socket.on(events.SEND_MESSAGE, async (payload) => {
        try {
            console.log("Mensaje de chat recibido:", payload);
            const data = {
                chatId: payload.chatId,
                userId: payload.senderUserId,
                touserId: payload.recipientId,
                message: payload.messageContent
            };
      
            const savedMessage = await StandardMessage.createStandardMessage(data);
            socket.broadcast.to(payload.chatId).emit(events.RECEIVE_MESSAGE, savedMessage); // Enviar el mensaje guardado de vuelta a los usuarios
        } catch (error) {
            console.error("Error al guardar el mensaje:", error);
        }
    });
};
export const handleLeaveChat = (socket) => {
    socket.on(events.LEAVE_CHAT, (payload) => {
        socket.leave(payload);
        console.log(`Salió del chat ${payload}`);
    });
};

export const handleTypingStatus = (socket) => {
    socket.on(events.TYPING_STATUS, (payload) => {
        socket.broadcast.to(payload.chatId).emit(events.TYPING_STATUS, payload);
        console.log(`Usuario con ID ${payload.userId} está escribiendo en el chat ${payload.chatId}`);
    });
};

export const handleUserJoined = (socket) => {
    socket.on(events.USER_JOINED, (payload) => {
        socket.broadcast.to(payload.chatId).emit(events.USER_JOINED, payload);
        console.log(`Nuevo usuario con ID ${payload.userId} se unió al chat ${payload.chatId}`);
    });
};

export const handleUserLeft = (socket) => {
    socket.on(events.USER_LEFT, (payload) => {
        socket.broadcast.to(payload.chatId).emit(events.USER_LEFT, payload);
        console.log(`Usuario con  dejó el chat `);
    });
};

export const handleChatHistoryRequest = (socket) => {
    socket.on(events.CHAT_HISTORY_REQUEST, async (payload) => {
        try {
            const chatHistory = await StandardMessage.getChatHistory(payload.chatId);
            socket.emit(events.CHAT_HISTORY_RESPONSE, chatHistory);
        } catch (error) {
            console.error("Error al obtener el historial de mensajes:", error);
        }
    });
};
