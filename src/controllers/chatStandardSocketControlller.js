import * as StandardMessage from "../Models/ModelStandardMessage.js";
import { events } from "../enums/standardChatsEvents.js";


export const handleJoinChat = (socket) => {
    socket.on(events.JOIN_CHAT, (payload) => {
        socket.chatId = payload;
    });
};
export const handleSendMessage = (socket) => {
    socket.on(events.SEND_MESSAGE, async (payload) => {
        try {
            const data = {
                chatId: payload.chatId,
                userId: payload.senderUserId,
                touserId: payload.recipientId,
                message: payload.messageContent
            };
      
            const savedMessage = await StandardMessage.createStandardMessage(data);
            socket.broadcast.to(payload.chatId).emit(events.RECEIVE_MESSAGE, savedMessage);
        } catch (error) {
        }
    });
};
export const handleLeaveChat = (socket) => {
    socket.on(events.LEAVE_CHAT, (payload) => {
        socket.leave(payload);
    });
};

export const handleTypingStatus = (socket) => {
    socket.on(events.TYPING_STATUS, (payload) => {
        socket.broadcast.to(payload.chatId).emit(events.TYPING_STATUS, payload);
    });
};

export const handleUserJoined = (socket) => {
    socket.on(events.USER_JOINED, (payload) => {
        socket.broadcast.to(payload.chatId).emit(events.USER_JOINED, payload);
    });
};

export const handleUserLeft = (socket) => {
    socket.on(events.USER_LEFT, (payload) => {
        socket.broadcast.to(payload.chatId).emit(events.USER_LEFT, payload);
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
