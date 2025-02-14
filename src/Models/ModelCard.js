import { db, CardTable } from '../awsconfig/database.js';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const encryptCVV = (cvv) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(String(process.env.ENCRYPTION_KEY)).digest('base64').substr(0, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(cvv, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
};

const createCardRecord = async (data, userId) => {
    const timestamp = new Date().toISOString();
    const { encryptedData, iv } = encryptCVV(data.cvv);

    const cardParams = {
        TableName: CardTable,
        Item: {
            id: uuidv4(),
            userId: userId,
            position: data.position,
            automatic: data.automatic,
            billinperiod: data.billinperiod,
            number: data.number,
            expiration: data.expiration,
            firstName: data.firstName,
            lastName: data.lastName,
            country: data.country,
            billingAddress1: data.billingAddress1,
            billingAddress2: data.billingAddress2,
            cvv: encryptedData,
            iv: iv,
            createdAt: timestamp,
        },
    };

    try {
        await db.send(new PutCommand(cardParams));
        return { success: true, message: 'Card details saved successfully' };
    } catch (error) {
        console.error('Error saving card details:', error.message);
        return { success: false, message: 'Error saving card details', error: error.message };
    }
};

const getCardsByUser = async (userId) => {
    const params = {
        TableName: CardTable,
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    };

    try {
        const { Items = [] } = await db.send(new ScanCommand(params));
        return { success: true, data: Items };
    } catch (error) {
        console.error('Error fetching cards for userId:', error.message);
        return { success: false, message: 'Error fetching cards', error: error.message };
    }
};
const updateCardRecord = async (cardId, userId, updateData) => {
    const updateParams = {
        TableName: CardTable,
        Key: {
            id: cardId,
        },
        UpdateExpression: `
            set #number = :number, 
                expiration = :expiration, 
                firstName = :firstName, 
                lastName = :lastName, 
                country = :country, 
                billingAddress1 = :billingAddress1, 
                billingAddress2 = :billingAddress2
        `,
        ExpressionAttributeNames: {
            "#number": "number", // "number" es una palabra reservada en DynamoDB, por eso usamos un alias.
        },
        ExpressionAttributeValues: {
            ":number": updateData.number,
            ":expiration": updateData.expiration,
            ":firstName": updateData.firstName,
            ":lastName": updateData.lastName,
            ":country": updateData.country,
            ":billingAddress1": updateData.billingAddress1,
            ":billingAddress2": updateData.billingAddress2,
            ":userId": userId,
        },
        ConditionExpression: "userId = :userId",
        ReturnValues: "ALL_NEW",
    };

    try {
        const { Attributes } = await db.send(new UpdateCommand(updateParams));
        return { success: true, data: Attributes };
    } catch (error) {
        console.error("Error updating card details:", error.message);
        return { success: false, message: "Error updating card details", error: error.message };
    }
};

const deleteCardRecord = async (cardId, userId) => {
    const deleteParams = {
        TableName: CardTable,
        Key: {
            id: cardId,
        },
        ConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    };

    try {
        await db.send(new DeleteCommand(deleteParams));
        return { success: true, message: 'Card record deleted successfully' };
    } catch (error) {
        console.error('Error deleting card record:', error.message);
        return { success: false, message: 'Error deleting card record', error: error.message };
    }
};
export {
    createCardRecord,
    updateCardRecord,
    deleteCardRecord,
    getCardsByUser
};