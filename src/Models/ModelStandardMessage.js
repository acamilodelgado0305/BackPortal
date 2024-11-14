import { standardMessagesTable, db } from '../awsconfig/database.js';
import { PutCommand, GetCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// Función para verificar si ya existe un chat entre dos usuarios
const getExistingChatId = async (senderUserId, recipientUserId) => {
  const params = {
    TableName: standardMessagesTable,
    IndexName: 'SenderRecipientIndex', // Asegurarse de que tenga un índice GSI en la tabla que permita buscar por sender y recipient.
    KeyConditionExpression: 'senderUserId = :senderUserId AND recipientUserId = :recipientUserId',
    ExpressionAttributeValues: {
      ':senderUserId': senderUserId,
      ':recipientUserId': recipientUserId,
    },
  };

  try {
    const { Items = [] } = await db.send(new QueryCommand(params));
    if (Items.length > 0) {
      return Items[0].chatId;
    }
    return null; 
  } catch (error) {
    console.error('Error fetching existing chat:', error.message);
    throw new Error('Error fetching existing chat');
  }
};

export const createStandardMessage = async (data) => {
  const timestamp = new Date().toISOString();
  const standardMessageId = uuidv4();

  try {
    let chatId = null // await getExistingChatId(data.userId, data.touserId);
    
    if (!chatId) {
      chatId = uuidv4();
    }

    const params = {
      TableName: standardMessagesTable,
      Item: {
        id: standardMessageId,
        createdAt: timestamp,
        updatedAt: timestamp,
        senderUserId: data.userId,
        recipientUserId: data.touserId,
        chatId,
        messageContent: data.message,
      },
    };

    await db.send(new PutCommand(params));
    return { success: true, id: standardMessageId, chatId };
  } catch (error) {
    console.error('Error creating standardMessage:', error.message);
    return { success: false, message: 'Error creating standardMessage', error: error.message };
  }
};

export const getStandardMessagesByChatId = async (chatId) => {
  const params = {
    TableName: standardMessagesTable,
    IndexName: 'ChatIdIndex', 
    KeyConditionExpression: 'chatId = :chatId',
    ExpressionAttributeValues: {
      ':chatId': chatId,
    },
  };

  try {
    const { Items = [] } = await db.send(new QueryCommand(params));
    if (Items.length === 0) {
      return { success: false, message: 'No messages found for this chatId', data: [] };
    }
    return { success: true, data: Items };
  } catch (error) {
    console.error(`Error fetching messages by chatId ${chatId}:`, error.message);
    return { success: false, message: 'Error fetching messages by chatId', error: error.message, data: [] };
  }
};

export const updateStandardMessage = async (id, data = {}) => {
  const timestamp = new Date().toISOString();

  const existingMessageResponse = await getStandardMessageById(id);

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
      updatedAt: timestamp,
    },
  };

  try {
    await db.send(new PutCommand(params));
    return { success: true, id: id };
  } catch (error) {
    console.error('Error updating StandardMessage:', error.message);
    return { success: false, message: 'Error updating StandardMessage', error: error.message };
  }
};

export const getStandardMessageById = async (value, key = 'id') => {
  const params = {
    TableName: standardMessagesTable,
    Key: {
      [key]: value,
    },
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

export const deleteStandardMessageById = async (id) => {
  const params = {
    TableName: standardMessagesTable,
    Key: {
      id: id,
    },
  };

  try {
    await db.send(new DeleteCommand(params));
    return { success: true, message: `StandardMessage with id ${id} deleted successfully` };
  } catch (error) {
    console.error(`Error deleting StandardMessage with id ${id}:`, error.message);
    return { success: false, message: `Error deleting StandardMessage with id ${id}`, error: error.message };
  }
};
