import { Table, UserTable, db } from '../awsconfig/database.js';
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';


// Crear Teacher
const createTeacher = async (data = {}) => {
  const timestamp = new Date().toISOString();
  const teacherId = uuidv4();  // Generar un UUID para un nuevo teacher

 const { password, ...dataWithoutPassword } = data;

 const params = {
   TableName: Table,
   Item: {
     ...dataWithoutPassword,  
     id: teacherId, 
     createdAt: timestamp,
     updatedAt: timestamp,
     status: false 
   }
 };

  const userParams = {
    TableName: UserTable,
    Item: {
      id: teacherId,
      email: data.email,
      password: data.password,
      role: 'teacher',
      createdAt: timestamp,
      updatedAt: timestamp,
    }

  };
  try {
    await db.send(new PutCommand(params));
    await db.send(new PutCommand(userParams));
    return { success: true, id: teacherId };
  } catch (error) {
    console.error('Error creating teacher:', error.message);
    return { success: false, message: 'Error creating teacher', error: error.message };
  }
};

// Actualizar Teacher
const updateTeacher = async (id, data = {}) => {
  const timestamp = new Date().toISOString();

  // Verificar si el Teacher existe antes de actualizar
  const existingTeacher = await getTeacherById(id);

  if (!existingTeacher.success) {
    return { success: false, message: 'Teacher not found, cannot update' };
  }

  const params = {
    TableName: Table,
    Item: {
      ...existingTeacher.data,  // Mantener los datos existentes
      ...data,                  // Sobrescribir con los nuevos datos
      id: id,                   // Asegurar que el id es correcto
      updatedAt: timestamp      // Actualizar el campo updatedAt
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

// Leer todos los Teachers
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

export {
  createTeacher,
  updateTeacher,
  readAllTeachers,
  getTeacherById,
  deleteTeacherById
};
