import { studentTable, db } from '../awsconfig/database.js';
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';


// Crear Student
const createStudent = async (data = {}) => {
  const timestamp = new Date().toISOString();
  const studentId = uuidv4();  // Generar un UUID para un nuevo Student

  const params = {
    TableName: studentTable,
    Item: {
      ...data,
      id: studentId,  // Usar el UUID generado
      createdAt: timestamp,
      updatedAt: timestamp
    }
};

  try {
    await db.send(new PutCommand(params));
    return { success: true, id: studentId };
  } catch (error) {
    console.error('Error creating student:', error.message);
    return { success: false, message: 'Error creating student', error: error.message };
  }
};

// Actualizar Student
const updateStudent = async (id, data = {}) => {
  const timestamp = new Date().toISOString();

  // Verificar si el Student existe antes de actualizar
  const existingStudent = await getStudentById(id);
  
  if (!existingStudent.success) {
    return { success: false, message: 'student not found, cannot update' };
  }

  const params = {
    TableName: studentTable,
    Item: {
      ...existingStudent.data,  // Mantener los datos existentes
      ...data,                  // Sobrescribir con los nuevos datos
      id: id,                   // Asegurar que el id es correcto
      updatedAt: timestamp      // Actualizar el campo updatedAt
    }
  };
  try {
    await db.send(new PutCommand(params));
    return { success: true, id: id };
  } catch (error) {
    console.error('Error updating student:', error.message);
    return { success: false, message: 'Error updating student', error: error.message };
  }
};

// Leer todos los Students
const readAllStudents = async () => {
  const params = {
    TableName: studentTable
  };

  try {
    const { Items = [] } = await db.send(new ScanCommand(params));
    return { success: true, data: Items };
  } catch (error) {
    console.error('Error reading all students:', error.message);
    return { success: false, message: 'Error reading all students', error: error.message, data: null };
  }
};

// Leer Student por ID
const getStudentById = async (value, key = 'id') => {
  const params = {
    TableName: studentTable,
    Key: {
      [key]: value // No más parseInt, ya que UUID es un string
    }
  };

  try {
    const { Item = {} } = await db.send(new GetCommand(params));
    if (Object.keys(Item).length === 0) {
      return { success: false, message: 'student not found', data: null };
    }
    return { success: true, data: Item };
  } catch (error) {
    console.error(`Error reading student with ${key} = ${value}:`, error.message);
    return { success: false, message: `Error reading student with ${key} = ${value}`, error: error.message, data: null };
  }
};

// Eliminar Student por ID
const deleteStudentById = async (value, key = 'id') => {
  const params = {
    TableName: studentTable,
    Key: {
      [key]: value // No se usa parseInt porque el id es un UUID (string)
    }
  };

  try {
    await db.send(new DeleteCommand(params));
    return { success: true, message: `student with ${key} = ${value} deleted successfully` };
  } catch (error) {
    console.error(`Error deleting Student with ${key} = ${value}:`, error.message);
    return { success: false, message: `Error deleting student with ${key} = ${value}`, error: error.message };
  }
};

export {
  createStudent,
  updateStudent,
  readAllStudents,
  getStudentById,
  deleteStudentById
};
