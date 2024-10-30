import * as User from '../Models/ModelUser.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cognitoService } from '../awsconfig/cognitoUtils.js';




// Crear Usuario
export const createUserHandler = async (req, res) => {
    try {
        const userData = req.body;
        const result = await User.createUser(userData);

        if (result.success) {
            return res.status(201).json({ 
                success: true, 
                id: result.id,
                message: 'Usuario creado exitosamente'
            });
        }
        return res.status(500).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Error al crear usuario',
            error: error.message 
        });
    }
};

// Controlador de inicio de sesión
export const loginUserHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Autenticar con Cognito
        const authResult = await cognitoService.signIn(email, password);
        
        // Obtener datos adicionales del usuario de DynamoDB
        const user = await User.getUserByEmail(email);

        return res.status(200).json({
            success: true,
            accessToken: authResult.accessToken,
            idToken: authResult.idToken,
            refreshToken: authResult.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        return res.status(401).json({ 
            success: false, 
            message: 'Error en la autenticación',
            error: error.message 
        });
    }
};

// Leer todos los Usuarios
export const readAllUsersHandler = async (req, res) => {
    const result = await User.readAllUsers();

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(500).json({ success: false, message: result.message });
};

// Leer Usuario por ID
export const getUserByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await User.getUserById(id);

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: result.message });
};

// Eliminar Usuario por ID
export const deleteUserByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await User.deleteUserById(id);

    if (result.success) {
        return res.json({ success: true, message: result.message });
    }
    return res.status(404).json({ success: false, message: result.message });
};

// Actualizar Usuario
export const updateUserHandler = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    const result = await User.updateUser(id, userData);

    if (result.success) {
        return res.json({ success: true, id });
    }
    return res.status(404).json({ success: false, message: result.message });
};
