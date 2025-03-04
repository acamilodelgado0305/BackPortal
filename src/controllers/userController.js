import * as User from '../Models/ModelUser.js';
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
                id: user.data.id,
                email: user.data.email,
                role: user.data.role,
                roleId: user.data.roleId,
                lastName:user.data.lastName,
                firstName: user.data.firstName,
                paypalId: user.data.paypalId
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

export const readAllUsersHandler = async (req, res) => {
    const result = await User.readAllUsers();

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(500).json({ success: false, message: result.message });
};


export const getUserByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await User.getUserById(id);

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const deleteUserByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await User.deleteUserById(id);

    if (result.success) {
        return res.json({ success: true, message: result.message });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const updateUserHandler = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    const result = await User.updateUser(id, userData);

    if (result.success) {
        return res.json({ success: true, id });
    }
    return res.status(404).json({ success: false, message: result.message });
};





export const verifyEmailHandler = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: 'Email y código son requeridos'
            });
        }

        const result = await User.verifyUserEmail(email, code);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message
            });
        }

        return res.status(400).json({
            success: false,
            message: result.message
        });
    } catch (error) {
        console.error('Error en verifyEmailHandler:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error en la verificación del email'
        });
    }
};



export const resendVerificationCodeHandler = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email es requerido'
            });
        }

        // Verifica si el usuario existe y no está verificado
        const userResult = await User.getUserByEmail(email);
        if (!userResult.success) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Reenvía el código
        await cognitoService.resendConfirmationCode(email);

        return res.status(200).json({
            success: true,
            message: 'Se ha enviado un nuevo código de verificación a tu email'
        });
    } catch (error) {
        console.error('Error al reenviar código:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error al reenviar el código de verificación'
        });
    }
};