import { ListUsersCommand, AdminConfirmSignUpCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { db, UserTable } from '../awsconfig/database.js';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { cognitoClient, cognitoService } from '../awsconfig/cognitoUtils.js';


// Función para verificar si el usuario existe en `UserTable`
const checkUserExistsInUserTable = async (email) => {
    const params = {
        TableName: UserTable,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email }
    };
    const { Items } = await db.send(new ScanCommand(params));
    return Items.length > 0;
};

// Crear usuario en Cognito y `UserTable`
export const createUser = async (data) => {
    try {
        // Crear usuario en Cognito sin confirmación automática
        const cognitoResult = await cognitoService.signUp(data.email, data.password, data.phone_number);
        console.log('Usuario registrado en Cognito:', cognitoResult.userSub);

        // Verificar si el usuario ya existe en `UserTable`
        const userExists = await checkUserExistsInUserTable(data.email);
        if (userExists) {
            console.log('El correo electrónico ya está registrado en UserTable. No se creará un nuevo registro.');
            return { success: true, message: 'Usuario registrado en Cognito, ya existente en UserTable.' };
        }

        // Guardar en `UserTable` si no existe
        const timestamp = new Date().toISOString();
        const userId = cognitoResult.userSub;
        const params = {
            TableName: UserTable,
            Item: {
                id: userId,
                email: data.email,
                role: data.role,
                createdAt: timestamp,
                updatedAt: timestamp
            }
        };
        await db.send(new PutCommand(params));

        return { success: true, id: userId, message: "Usuario creado exitosamente en Cognito y registrado en UserTable." };

    } catch (error) {
        console.error('Error creando usuario:', error);
        return { success: false, message: error.message };
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