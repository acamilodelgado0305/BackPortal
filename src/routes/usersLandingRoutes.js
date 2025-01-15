import express from 'express';
import { createUser, getAllUsers, deleteUser } from '../controllers/usersLandingController.js';

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/create', createUser);

// Ruta para obtener todos los usuarios
router.get('/getall', getAllUsers);

// Ruta para eliminar un usuario por ID
router.delete('/delete/:id', deleteUser);

export default router;
