import { db, TransactionTable } from '../awsconfig/database.js';
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const createTransaction = async (data = {}) => {
    const timestamp = new Date().toISOString();
    const transactionId = uuidv4();
    const transactionParams = {
        TableName: TransactionTable,
        Item: {
            id: transactionId,
            transactionId: data.transactionDetails.transactionId,
            payerName: data.transactionDetails.payerName,
            payerEmail: data.transactionDetails.payerEmail,
            amount: data.transactionDetails.amount,
            currency: data.transactionDetails.currency,
            studentId: data.student.id,
            teacherId: data.teacher.id,
            classDetails: data.classDetails,
            status: "Completed", // Puede cambiar según el flujo del pago
            createdAt: timestamp,
        },
    };

    try {
        await db.send(new PutCommand(transactionParams));
        return { success: true, id: transactionId };
    } catch (error) {
        console.error('Error creating transaction:', error.message);
        return { success: false, message: 'Error creating transaction', error: error.message };
    }
};

const getAllTransactions = async () => {
    const params = {
        TableName: TransactionTable,
    };

    try {
        const { Items = [] } = await db.send(new ScanCommand(params));
        return { success: true, data: Items };
    } catch (error) {
        console.error('Error fetching all transactions:', error.message);
        return { success: false, message: 'Error fetching transactions', error: error.message, data: null };
    }
};

const getTransactionById = async (id) => {
    const params = {
        TableName: TransactionTable,
        Key: {
            id,
        },
    };

    try {
        const { Item = {} } = await db.send(new GetCommand(params));
        if (Object.keys(Item).length === 0) {
            return { success: false, message: 'Transaction not found', data: null };
        }
        return { success: true, data: Item };
    } catch (error) {
        console.error(`Error fetching transaction with id ${id}:`, error.message);
        return { success: false, message: `Error fetching transaction`, error: error.message, data: null };
    }
};

const deleteTransactionById = async (id) => {
    const params = {
        TableName: TransactionTable,
        Key: {
            id,
        },
    };

    try {
        await db.send(new DeleteCommand(params));
        return { success: true, message: `Transaction with id ${id} deleted successfully` };
    } catch (error) {
        console.error(`Error deleting transaction with id ${id}:`, error.message);
        return { success: false, message: `Error deleting transaction`, error: error.message };
    }
};

const getTransactionsByStudentId = async (studentId) => {
    const params = {
        TableName: TransactionTable,
        FilterExpression: "studentId = :studentId",
        ExpressionAttributeValues: {
            ":studentId": studentId,
        },
    };

    try {
        const { Items = [] } = await db.send(new ScanCommand(params));
        return { success: true, data: Items };
    } catch (error) {
        console.error(`Error fetching transactions for studentId ${studentId}:`, error.message);
        return { success: false, message: `Error fetching transactions for studentId ${studentId}`, error: error.message, data: null };
    }
};

const getTransactionsByTeacherId = async (teacherId) => {
    const params = {
        TableName: TransactionTable,
        FilterExpression: "teacherId = :teacherId",
        ExpressionAttributeValues: {
            ":teacherId": teacherId,
        },
    };

    try {
        const { Items = [] } = await db.send(new ScanCommand(params));
        return { success: true, data: Items };
    } catch (error) {
        console.error(`Error fetching transactions for teacherId ${teacherId}:`, error.message);
        return { success: false, message: `Error fetching transactions for teacherId ${teacherId}`, error: error.message, data: null };
    }
};

export {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    deleteTransactionById,
    getTransactionsByStudentId,
    getTransactionsByTeacherId,
};
