import { Table, UserTable, db } from '../awsconfig/database.js';
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { emailExists } from '../helpers/IsEmailExist.js';
import { cognitoService } from '../../src/awsconfig/cognitoUtils.js'

const createTeacher = async (data = {}) => {
  const timestamp = new Date().toISOString();
  const teacherId = uuidv4();  // Generar un UUID para un nuevo teacher
  const { password, ...dataWithoutPassword } = data;

  // Validar que el email esté presente antes de hacer la comprobación
  if (!data.email) {
    return { success: false, message: 'Email is required.' };
  }

  const isEmailTaken = await emailExists(data.email, UserTable);
  if (isEmailTaken) {
    return { success: false, message: 'Email is already registered.' };
  }

  // Validar la password antes de crear el usuario
  if (!password) {
    return { success: false, message: 'Password is required.' };
  }

  const cognitoId = uuidv4();

  // Construir parámetros para almacenar en la base de datos
  const params = {
    TableName: Table,
    Item: {
      ...dataWithoutPassword,
      id: teacherId,
      cognitoId: cognitoId,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: false, // Asumiendo que el status por defecto es 'false'
    },
  };

  const userData = {
    email: data.email,
    password,
    role: 'teacher',
  };

  console.log('Esta es la password de Model Teacher: ' + userData.password);

  // Si se requiere que la password se procese (ej., cifrado), hazlo antes de intentar registrar al usuario
  // const hashedPassword = await hashPassword(userData.password); // Si es necesario un hash

  try {
    // Guardar el nuevo teacher en la base de datos
    await db.send(new PutCommand(params));

    // Crear el usuario en Cognito (suponiendo que esta función está habilitada)
    /* const cognitoResult = await cognitoService.signUp(data.email, hashedPassword); */

    // Registrar el usuario en otro sistema (si es necesario)
    await User.createUser(userData);

    return { success: true, id: teacherId };
  } catch (error) {
    console.error('Error creating teacher:', error.message);
    return { success: false, message: 'Error creating teacher', error: error.message };
  }
};

const updateTeacher = async (id, data = {}) => {
  const timestamp = new Date().toISOString();
  const existingTeacher = await getTeacherById(id);

  if (!existingTeacher.success) {
    return { success: false, message: 'Teacher not found, cannot update' };
  }

  const params = {
    TableName: Table,
    Item: {
      ...existingTeacher.data,
      ...data,
      id: id,
      updatedAt: timestamp
    }
  };

  try {
    await db.send(new PutCommand(params));
    return { success: true, id: id };
  } catch (error) {
    console.error('Error updating teacher:', error.message);
    return { success: false, message: 'Error updating teacher', error: error.message };
  }
};

const readAllTeachers = async () => {
  const params = {
    TableName: Table
  };

  try {
    const { Items = [] } = await db.send(new ScanCommand(params));
    return { success: true, data: Items };
  } catch (error) {
    console.error('Error reading all teachers:', error.message);
    return { success: false, message: 'Error reading all teachers', error: error.message, data: null };
  }
};

// Leer Teacher por ID
const getTeacherById = async (value, key = 'id') => {
  const params = {
    TableName: Table,
    Key: {
      [key]: value // No más parseInt, ya que UUID es un string
    }
  };

  try {
    const { Item = {} } = await db.send(new GetCommand(params));
    if (Object.keys(Item).length === 0) {
      return { success: false, message: 'Teacher not found', data: null };
    }
    return { success: true, data: Item };
  } catch (error) {
    console.error(`Error reading teacher with ${key} = ${value}:`, error.message);
    return { success: false, message: `Error reading teacher with ${key} = ${value}`, error: error.message, data: null };
  }
};

// Eliminar Teacher por ID
const deleteTeacherById = async (value, key = 'id') => {
  const params = {
    TableName: Table,
    Key: {
      [key]: value // No se usa parseInt porque el id es un UUID (string)
    }
  };

  try {
    await db.send(new DeleteCommand(params));
    return { success: true, message: `Teacher with ${key} = ${value} deleted successfully` };
  } catch (error) {
    console.error(`Error deleting teacher with ${key} = ${value}:`, error.message);
    return { success: false, message: `Error deleting teacher with ${key} = ${value}`, error: error.message };
  }
};

const teacherExists = async (id) => {
  const result = await getTeacherById(id);
  return result.success;
};

export {
  createTeacher,
  updateTeacher,
  readAllTeachers,
  getTeacherById,
  deleteTeacherById,
  teacherExists
};
