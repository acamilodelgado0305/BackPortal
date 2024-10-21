import * as User from '../Models/ModelUser.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'portalesturio123';

// Crear Usuario
export const createUserHandler = async (req, res) => {
    const userData = req.body;
    const result = await User.createUser(userData);

    if (result.success) {
        return res.status(201).json({ success: true, id: result.id });
    }
    return res.status(500).json({ success: false, message: result.message });
};

// Controlador de inicio de sesión
export const loginUserHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Usar User.getUserByEmail para obtener el usuario por su email
        const user = await User.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña proporcionada con la almacenada (hash)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });

        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error.message);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
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
