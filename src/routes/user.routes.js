import express from 'express';
import {
    createUserHandler,
    readAllUsersHandler,
    getUserByIdHandler,
    deleteUserByIdHandler,
    updateUserHandler  // Asegúrate de tener esta función en el controlador
} from '../controllers/userController.js';

const router = express.Router();

// Crear un nuevo usuario
router.post("/", createUserHandler);

// Leer todos los usuarios
router.get("/", readAllUsersHandler);

// Obtener un usuario por ID
router.get("/:id", getUserByIdHandler);

// Eliminar un usuario por ID
router.delete("/:id", deleteUserByIdHandler);

// Actualizar un usuario por ID
router.put("/:id", updateUserHandler);

export default router;
