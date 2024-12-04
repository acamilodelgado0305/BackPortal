import { db, class_reservations } from '../awsconfig/database.js';
import { PutCommand, GetCommand, ScanCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';


// Crear reserva de clase
const createClass = async (data = {}) => {
  try {
    // Validar datos obligatorios
    if (!data.studentId || !data.teacherId) {
      throw new Error('studentId y teacherId son obligatorios.');
    }

    const timestamp = new Date().toISOString();
    const classId = uuidv4();

    // Parámetros para guardar en la base de datos
    const studentParams = {
      TableName: 'class_reservations', // Asegúrate de que esta tabla existe
      Item: {
        ...data,
        id: classId,
        studentId: data.studentId,
        teacherId: data.teacherId,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };

    // Guardar la reserva de clase
    await db.send(new PutCommand(studentParams));

    return { success: true, id: classId };
  } catch (error) {
    console.error('Error creating class reservation:', error.message);
    return {
      success: false,
      message: error.message,
      details: error.stack
    };
  }
};

// Actualizar reservacion de la clase
const updateClassReservation = async (id, data = {}) => {
  const timestamp = new Date().toISOString();

  // Verificar si la reserva existe antes de actualizar
  const existingClassReservation = await getClassReservationById(id);

  if (!existingClassReservation.success) {
    return { success: false, message: 'class not found, cannot update' };
  }

  const params = {
    TableName: class_reservations,
    Item: {
      ...existingClassReservation.data,
      ...data,
      id: id,
      updatedAt: timestamp
    }
  };
  try {
    await db.send(new PutCommand(params));
    return { success: true, id: id };
  } catch (error) {
    console.error('Error updating class reservation:', error.message);
    return { success: false, message: 'Error updating class reservation', error: error.message };
  }
};

// Leer todos los Students
const readAllReservationClass = async () => {
  const params = {
    TableName: class_reservations
  };

  try {
    const { Items = [] } = await db.send(new ScanCommand(params));
    return { success: true, data: Items };
  } catch (error) {
    console.error('Error reading all class reservations:', error.message);
    return { success: false, message: 'Error reading all class reservations', error: error.message, data: null };
  }
};

// Leer Student por ID
const getClassReservationById = async (value, key = 'id') => {
  const params = {
    TableName: class_reservations,
    Key: {
      [key]: value
    }
  };

  try {
    const { Item = {} } = await db.send(new GetCommand(params));
    if (Object.keys(Item).length === 0) {
      return { success: false, message: 'class not found', data: null };
    }
    return { success: true, data: Item };
  } catch (error) {
    console.error(`Error reading class reservation with ${key} = ${value}:`, error.message);
    return { success: false, message: `Error reading class reservation with ${key} = ${value}`, error: error.message, data: null };
  }
};
// leer reservacion actual 
const getClassReservationCurrentById = async (teacherId) => {
  const params = {
    TableName: class_reservations,
    IndexName: 'teacherId-index',
    KeyConditionExpression: 'teacherId = :teacherId',
    ExpressionAttributeValues: {
      ':teacherId': teacherId,
    },
  };
  try {
    const { Items = [] } = await db.send(new QueryCommand(params));
    if (Items.length === 0) {
      return { success: false, message: 'No class reservations found for the teacherId', data: null };
    }
    return { success: true, data: Items };
  } catch (error) {
    console.error(`Error reading class reservation with teacherId = ${teacherId}:`, error.message);
    return { success: false, message: `Error reading class reservation with teacherId = ${teacherId}`, error: error.message, data: null };
  }
};

// leer clase de estudiante
const getClassReservationCurrentByIdStudent = async (studentId, teacherId) => {
  const params = {
    TableName: 'class_reservations',
    IndexName: 'studentId-index', // Índice basado solo en studentId
    KeyConditionExpression: 'studentId = :studentId',
    FilterExpression: 'teacherId = :teacherId',
    ExpressionAttributeValues: {
      ':studentId': studentId,
      ':teacherId': teacherId,
    },
  };
  try {
    const { Items = [] } = await db.send(new QueryCommand(params));
    if (Items.length === 0) {
      return { success: false, message: 'No class reservations found for the studentId', data: null };
    }
    return { success: true, data: Items };
  } catch (error) {
    console.error(`Error reading class reservation with studentId = ${studentId}:`, error.message);
    return { success: false, message: `Error reading class reservation with studentId = ${studentId}`, error: error.message, data: null };
  }
};


// Eliminar Student por ID
const deleteClassReservationById = async (value, key = 'id') => {
  const params = {
    TableName: class_reservations,
    Key: {
      [key]: value
    }
  };

  try {
    await db.send(new DeleteCommand(params));
    return { success: true, message: `class reservation with ${key} = ${value} deleted successfully` };
  } catch (error) {
    console.error(`Error deleting class reservation with ${key} = ${value}:`, error.message);
    return { success: false, message: `Error deleting class reservation with ${key} = ${value}`, error: error.message };
  }
};

export {
  createClass,
  updateClassReservation,
  readAllReservationClass,
  getClassReservationById,
  deleteClassReservationById,
  getClassReservationCurrentById,
  getClassReservationCurrentByIdStudent
};
