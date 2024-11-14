import { standardMessagesTable, db } from '../awsconfig/database.js';
import { PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

export const createStanderdMessage = async (data) => {
    const timestamp = new Date().toISOString();
    const standardMessageId = uuidv4();
    const chatId = data.chatId ? data.chatId : uuidv4();

    const params = {
        TableName: standardMessagesTable,
        Item: {  
            id: standardMessageId,
            createdAt: timestamp,
            updatedAt: timestamp,
            senderUserId: data.userId, 
            recipientUserId: data.touserId,
            chatId,
            messageContent: data.message 
        }
    };

    try {
        await db.send(new PutCommand(params));
        return { success: true, id: standardMessageId };
    } catch (error) {
        console.error('Error creating standardMessage:', error.message);
        return { success: false, message: 'Error creating standardMessage', error: error.message };
    }
};

export const getStanderdMessagesByChatId = async (chatId) => {
    const params = {
        TableName: standardMessagesTable,
        IndexName: 'ChatIdIndex', 
        KeyConditionExpression: 'chatId = :chatId',
        ExpressionAttributeValues: {
            ':chatId': chatId
        }
    };

    try {
        const { Items = [] } = await db.send(new GetCommand(params));
        if (Items.length === 0) {
            return { success: false, message: 'No messages found for this chatId', data: [] };
        }
        return { success: true, data: Items };
    } catch (error) {
        console.error(`Error fetching messages by chatId ${chatId}:`, error.message);
        return { success: false, message: 'Error fetching messages by chatId', error: error.message, data: [] };
    }
};

export const updateStanderdMessage = async (id, data = {}) => {
    const timestamp = new Date().toISOString();

    const existingMessageResponse = await getStanderdMessageById(id);

    if (!existingMessageResponse.success) {
        return { success: false, message: 'StandardMessage not found, cannot update' };
    }

    const existingMessage = existingMessageResponse.data;

    const params = {
        TableName: standardMessagesTable,
        Item: {
            ...existingMessage,  
            ...data,             
            id: id,             
            updatedAt: timestamp
        }
    };

    try {
        await db.send(new PutCommand(params));
        return { success: true, id: id };
    } catch (error) {
        console.error('Error updating StanderdMessage:', error.message);
        return { success: false, message: 'Error updating StanderdMessage', error: error.message };
    }
};

export const getStanderdMessageById = async (value, key = 'id') => {
    const params = {
        TableName: standardMessagesTable,
        Key: {
            [key]: value
        }
    };

    try {
        const { Item = {} } = await db.send(new GetCommand(params));
        if (Object.keys(Item).length === 0) {
            return { success: false, message: 'StandardMessage not found', data: null };
        }
        return { success: true, data: Item };
    } catch (error) {
        console.error(`Error reading StandardMessage with ${key} = ${value}:`, error.message);
        return { success: false, message: `Error reading StandardMessage with ${key} = ${value}`, error: error.message, data: null };
    }
};

export const deleteStanderdMessageById = async (id) => {
    const params = {
        TableName: standardMessagesTable,
        Key: {
            id: id
        }
    };

    try {
        await db.send(new DeleteCommand(params));
        return { success: true, message: `StandardMessage with id ${id} deleted successfully` };
    } catch (error) {
        console.error(`Error deleting StandardMessage with id ${id}:`, error.message);
        return { success: false, message: `Error deleting StandardMessage with id ${id}`, error: error.message };
    }
};
