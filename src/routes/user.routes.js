import express from 'express';
import {
    createUserHandler,
    readAllUsersHandler,
    getUserByIdHandler,
    deleteUserByIdHandler,
    updateUserHandler,
    loginUserHandler,
    verifyEmailHandler,
    resendVerificationCodeHandler
} from '../controllers/userController.js';

const router = express.Router();

// Crear un nuevo usuario
router.post("/", createUserHandler);
router.post('/verify-email', verifyEmailHandler);
router.post('/resend-verification', resendVerificationCodeHandler);
// Leer todos los usuarios
router.get("/", readAllUsersHandler);
// Obtener un usuario por ID
router.get("/:id", getUserByIdHandler);
// Eliminar un usuario por ID
router.delete("/:id", deleteUserByIdHandler);
// Actualizar un usuario por ID
router.put("/:id", updateUserHandler);
// Ruta para el inicio de sesión (login)
router.post("/login", loginUserHandler);



export default router;
