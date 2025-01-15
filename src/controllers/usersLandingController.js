import { PutCommand, GetCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { db, UsersLanding } from '../awsconfig/database.js';

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Faltan datos obligatorios: name y email.' });
  }

  try {
    const params = {
      TableName: UsersLanding,
      Item: {
        id: `user-${Date.now()}`, // Generar un ID único
        name,
        email
      }
    };

    await db.send(new PutCommand(params));
    res.status(201).json({ message: 'Usuario creado con éxito.', user: params.Item });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error interno al crear el usuario.' });
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const params = {
      TableName: UsersLanding
    };

    const { Items } = await db.send(new ScanCommand(params));
    res.status(200).json(Items);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error interno al obtener los usuarios.' });
  }
};

// Eliminar un usuario por ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const params = {
      TableName: UsersLanding,
      Key: { id }
    };

    await db.send(new DeleteCommand(params));
    res.status(200).json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error interno al eliminar el usuario.' });
  }
};
