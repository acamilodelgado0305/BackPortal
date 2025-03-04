import {
    ListUsersCommand,
    AdminConfirmSignUpCommand,
    SignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { db, UserTable } from '../awsconfig/database.js';
import {
    PutCommand,
    ScanCommand,
    GetCommand,
    DeleteCommand,
    UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import { cognitoClient, cognitoService } from '../awsconfig/cognitoUtils.js';

// Función para verificar si el usuario existe en `UserTable`
const checkUserExistsInUserTable = async (email) => {
    const params = {
        TableName: UserTable,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email }
    };
    try {
        const { Items } = await db.send(new ScanCommand(params));
        return Items && Items.length > 0;
    } catch (error) {
        console.error('Error verificando usuario existente:', error);
        throw new Error('Error al verificar usuario existente');
    }
};

// Crear usuario en Cognito y `UserTable`
export const createUser = async (data) => {
    try {
        if (!data.email || !data.password || !data.role) {
            return {
                success: false,
                message: 'Email, password y role son requeridos'
            };
        }

        // Verificar si el usuario ya existe en `UserTable`
        const userExists = await checkUserExistsInUserTable(data.email);
        if (userExists) {
            return {
                success: false,
                message: 'El correo electrónico ya está registrado'
            };
        }

        // Crear usuario en Cognito
        const cognitoResult = await cognitoService.signUp(data.email, data.password);

        // Guardar en `UserTable`
        const timestamp = new Date().toISOString();
        const userId = cognitoResult.userSub;
        const params = {
            TableName: UserTable,
            Item: {
                id: data.roleId || userId,
                firstName: data.name,
                lastName: data.lastName,
                email: data.email,
                profileImageUrl: data.profileImageUrl,
                cognitoId: cognitoResult.username,
                role: data.role,
                roleId: data.roleId,
                emailVerified: false,
                createdAt: timestamp,
                updatedAt: timestamp
            }
        };
        await db.send(new PutCommand(params));

        return {
            success: true,
            id: userId,
            message: "Usuario creado exitosamente"
        };

    } catch (error) {
        console.error('Error creando usuario:', error);
        return {
            success: false,
            message: error.message
        };
    }
};

export const getUserById = async (id) => {
    if (!id) {
        return { success: false, message: 'ID es requerido' };
    }

    const params = {
        TableName: UserTable,
        Key: { id }
    };

    try {
        const { Item } = await db.send(new GetCommand(params));
        if (!Item) {
            return { success: false, message: 'Usuario no encontrado' };
        }
        return { success: true, data: Item };
    } catch (error) {
        console.error('Error leyendo usuario:', error);
        return {
            success: false,
            message: 'Error al obtener usuario'
        };
    }
};

// Eliminar Usuario
export const deleteUserById = async (id) => {
    if (!id) {
        return { success: false, message: 'ID es requerido' };
    }

    const params = {
        TableName: UserTable,
        Key: { id }
    };

    try {
        await db.send(new DeleteCommand(params));
        return {
            success: true,
            message: 'Usuario eliminado correctamente'
        };
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        return {
            success: false,
            message: 'Error al eliminar usuario'
        };
    }
};

// Actualizar Usuario
export const updateUser = async (id, data) => {
    if (!id || !data) {
        return { success: false, message: 'ID y datos son requeridos' };
    }

    const timestamp = new Date().toISOString();
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Construir dinámicamente la expresión de actualización
    if (data.email) {
        updateExpression.push('#email = :email');
        expressionAttributeNames['#email'] = 'email';
        expressionAttributeValues[':email'] = data.email;
    }

    if (data.role) {
        updateExpression.push('#role = :role');
        expressionAttributeNames['#role'] = 'role';
        expressionAttributeValues[':role'] = data.role;
    }

    // Siempre actualizar updatedAt
    updateExpression.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = timestamp;

    const params = {
        TableName: UserTable,
        Key: { id },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    };
     
    try {
        const result = await db.send(new UpdateCommand(params));
        return { success: true, data: result.Attributes };
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        return {
            success: false,
            message: 'Error al actualizar usuario'
        };
    }
};
export const updateUserProfileImageUrl = async (id, profileImageUrl) => {
    if (!id || !profileImageUrl) {
        return { success: false, message: 'ID y profileImageUrl son requeridos' };
    }

    const timestamp = new Date().toISOString();

    const params = {
        TableName: UserTable,
        Key: { id },
        UpdateExpression: 'SET #profileImageUrl = :profileImageUrl, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#profileImageUrl': 'profileImageUrl'
        },
        ExpressionAttributeValues: {
            ':profileImageUrl': profileImageUrl,
            ':updatedAt': timestamp
        },
        ReturnValues: 'ALL_NEW'
    };

    try {
        const result = await db.send(new UpdateCommand(params));
        return { success: true, data: result.Attributes };
    } catch (error) {
        console.error('Error actualizando profileImageUrl:', error);
        return { success: false, message: 'Error al actualizar profileImageUrl' };
    }
};
export const updateIdPaypal = async (id, paypalId) => {
    if (!id || !paypalId) {
        return { success: false, message: 'ID y paypalId son requeridos' };
    }

    const timestamp = new Date().toISOString();

    const params = {
        TableName: UserTable,
        Key: { id },
        UpdateExpression: 'SET #paypalId = :paypalId, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#paypalId': 'paypalId'
        },
        ExpressionAttributeValues: {
            ':paypalId': paypalId,
            ':updatedAt': timestamp
        },
        ReturnValues: 'ALL_NEW'
    };

    try {
        const result = await db.send(new UpdateCommand(params));
        return { success: true, data: result.Attributes };
    } catch (error) {
        console.error('Error actualizando el paypal id:', error);
        return { success: false, message: 'Error al actualizar paypalId' };
    }
};


// Obtener Usuario por Email
export const getUserByEmail = async (email) => {
    if (!email) {
        return { success: false, message: 'Email es requerido' };
    }

    const params = {
        TableName: UserTable,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
        }
    };

    try {
        const { Items } = await db.send(new ScanCommand(params));
        if (!Items || Items.length === 0) {
            return { success: false, message: 'Usuario no encontrado' };
        }
        return { success: true, data: Items[0] };
    } catch (error) {
        console.error('Error obteniendo usuario por email:', error);
        return {
            success: false,
            message: 'Error al obtener usuario'
        };
    }
};

// Verificar Email de Usuario
export const verifyUserEmail = async (email, code) => {
    try {
        // Verificar el código con Cognito
        const verifyResult = await cognitoService.confirmSignUp(email, code);

        if (!verifyResult.success) {
            throw new Error('Error al verificar el email');
        }

        // Actualizar el estado en DynamoDB
        const userResult = await getUserByEmail(email);
        if (!userResult.success) {
            throw new Error('Usuario no encontrado en la base de datos');
        }

        const params = {
            TableName: UserTable,
            Key: { id: userResult.data.id },
            UpdateExpression: "set emailVerified = :v, updatedAt = :u",
            ExpressionAttributeValues: {
                ":v": true,
                ":u": new Date().toISOString()
            },
            ReturnValues: "ALL_NEW"
        };

        await db.send(new UpdateCommand(params));

        return {
            success: true,
            message: "Email verificado exitosamente"
        };
    } catch (error) {
        console.error('Error en la verificación del email:', error);
        return {
            success: false,
            message: error.message
        };
    }
};