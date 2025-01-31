import { PutCommand, UpdateCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { db, UsersLanding } from '../awsconfig/database.js';

// 🔹 Crear un nuevo usuario con `createdAt`
export const createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Faltan datos obligatorios: name y email.' });
  }

  try {
    const timestamp = new Date().toISOString();

    const params = {
      TableName: UsersLanding,
      Item: {
        id: `user-${Date.now()}`, // ID único
        name,
        email,
        createdAt: timestamp,
        updatedAt: timestamp
      },
    };

    await db.send(new PutCommand(params));
    res.status(201).json({ message: 'Usuario creado con éxito.', user: params.Item });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error interno al crear el usuario.' });
  }
};

// 🔹 Actualizar un usuario con `updatedAt`
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }

  try {
    const timestamp = new Date().toISOString();

    const params = {
      TableName: UsersLanding,
      Key: { id },
      UpdateExpression: 'SET name = :name, email = :email, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':name': name,
        ':email': email,
        ':updatedAt': timestamp
      },
      ReturnValues: 'ALL_NEW'
    };

    const { Attributes } = await db.send(new UpdateCommand(params));
    res.status(200).json({ message: 'Usuario actualizado con éxito.', user: Attributes });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno al actualizar usuario.' });
  }
};

// 🔹 Obtener todos los usuarios incluyendo `createdAt`
export const getAllUsers = async (req, res) => {
  try {
    const params = { TableName: UsersLanding };
    const { Items } = await db.send(new ScanCommand(params));

    res.status(200).json(Items.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt || 'No disponible', // 📌 Si no existe, mostrar "No disponible"
      updatedAt: user.updatedAt || 'No disponible'
    })));
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error interno al obtener los usuarios.' });
  }
};

// 🔹 Eliminar un usuario
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
