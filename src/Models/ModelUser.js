import { db, UserTable } from '../awsconfig/database.js';
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// Crear Usuario
export const createUser = async (data = {}) => {
    const timestamp = new Date().toISOString();
    const userId = uuidv4();  // Generar un UUID para un nuevo usuario

    const params = {
        TableName: UserTable,  // Usar la tabla de usuarios
        Item: {
            ...data,
            id: userId,  // Usar el UUID generado
            createdAt: timestamp,
            updatedAt: timestamp
        }
    };

    try {
        await db.send(new PutCommand(params));  // Enviar a DynamoDB
        return { success: true, id: userId };
    } catch (error) {
        console.error('Error creando usuario:', error.message);
        return { success: false, message: 'Error creando usuario', error: error.message };
    }
};

// Leer todos los Usuarios
export const readAllUsers = async () => {
    const params = {
        TableName: UserTable
    };

    try {
        const { Items = [] } = await db.send(new ScanCommand(params));
        return { success: true, data: Items };
    } catch (error) {
        console.error('Error leyendo usuarios:', error.message);
        return { success: false, message: 'Error leyendo usuarios', error: error.message, data: null };
    }
};

// Leer Usuario por ID
export const getUserById = async (id) => {
    const params = {
        TableName: UserTable,
        Key: {
            id: id
        }
    };

    try {
        const { Item } = await db.send(new GetCommand(params));
        if (!Item) {
            return { success: false, message: 'Usuario no encontrado' };
        }
        return { success: true, data: Item };
    } catch (error) {
        console.error(`Error leyendo usuario con id = ${id}:`, error.message);
        return { success: false, message: `Error leyendo usuario con id = ${id}`, error: error.message };
    }
};

// Eliminar Usuario por ID
export const deleteUserById = async (id) => {
    const params = {
        TableName: UserTable,
        Key: {
            id: id
        }
    };

    try {
        await db.send(new DeleteCommand(params));
        return { success: true, message: `Usuario con id = ${id} eliminado correctamente` };
    } catch (error) {
        console.error(`Error eliminando usuario con id = ${id}:`, error.message);
        return { success: false, message: `Error eliminando usuario con id = ${id}`, error: error.message };
    }
};
