import { v4 as uuidv4 } from 'uuid';
import { db, UserTable } from '../awsconfig/database.js';
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { cognitoService } from '../awsconfig/cognitoUtils.js';

// Crear Usuario
export const createUser = async (data = {}) => {
    try {
        // 1. Registrar usuario en Cognito
        const cognitoResult = await cognitoService.signUp(data.email, data.password);
        
        // 2. Confirmar automáticamente el usuario (opcional, depende de tus requisitos)
        await cognitoService.adminConfirmSignUp(data.email);

        // 3. Crear entrada en DynamoDB para datos adicionales
        const timestamp = new Date().toISOString();
        const userId = cognitoResult.userSub; // Usar el ID de Cognito

        const params = {
            TableName: UserTable,
            Item: {
                id: userId,
                email: data.email,
                role: data.role,
                createdAt: timestamp,
                updatedAt: timestamp
                // No almacenamos la contraseña en DynamoDB ya que está en Cognito
            }
        };

        await db.send(new PutCommand(params));
        return { success: true, id: userId };
    } catch (error) {
        console.error('Error creando usuario:', error);
        return { success: false, message: error.message };
    }
};

// La función de login se moverá al controlador

// Las demás funciones permanecen igual pero sin manejar contraseñas
export const readAllUsers = async () => {
    const params = {
        TableName: UserTable
    };

    try {
        const { Items = [] } = await db.send(new ScanCommand(params));
        return { success: true, data: Items };
    } catch (error) {
        console.error('Error leyendo usuarios:', error.message);
        return { success: false, message: 'Error leyendo usuarios', error: error.message };
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

// Actualizar Usuario
export const updateUser = async (id, data) => {
    const timestamp = new Date().toISOString();

    // Si se está actualizando la contraseña, encriptarla
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);  // Salt rounds = 10
    }

    const params = {
        TableName: UserTable,
        Key: { id },
        UpdateExpression: 'set email = :email, #role = :role, password = :password, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#role': 'role'
        },
        ExpressionAttributeValues: {
            ':email': data.email,
            ':role': data.role,
            ':password': data.password,
            ':updatedAt': timestamp
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const result = await db.send(new PutCommand(params));
        return { success: true, data: result.Attributes };
    } catch (error) {
        console.error(`Error actualizando usuario con id = ${id}:`, error.message);
        return { success: false, message: `Error actualizando usuario con id = ${id}`, error: error.message };
    }
};

export const getUserByEmail = async (email) => {
    const params = {
        TableName: UserTable,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
        }
    };

    try {
        const { Items } = await db.send(new ScanCommand(params));  // Usar ScanCommand en lugar de QueryCommand
        if (Items.length === 0) {
            return null;  // No se encontró el usuario
        }
        return Items[0];  // Devolver el primer usuario encontrado
    } catch (error) {
        console.error('Error obteniendo usuario por email:', error.message);
        throw new Error('Error obteniendo usuario');
    }
};