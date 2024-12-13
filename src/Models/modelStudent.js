import { studentTable, db, UserTable } from '../awsconfig/database.js';
import { PutCommand, GetCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'; 
import { emailExists } from '../helpers/IsEmailExist.js';
import * as User from './ModelUser.js'

// Crear Student y Usuario
const createStudent = async (data = {}) => {
  const timestamp = new Date().toISOString();
  //const studentId = uuidv4();
  //const hashedPassword = await bcrypt.hash(data.password, 10);

  // Verificar si el correo ya está registrado en la tabla de usuarios
  const isEmailTaken = await emailExists(data.email, studentTable);
  if (isEmailTaken) {
    return { success: false, message: 'Email is already registered.' };
  }
  //const cognitoId =  uuidv4();
 
  // Guardar el estudiante en la tabla de estudiantes (sin la contraseña)
  const studentParams = {
    TableName: studentTable,
    Item: {
      ...data,
      id: data.id,
      misClases:[],
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

     try {
    if(data.url) 
     await User.updateUserProfileImageUrl(data.id, data.url)
     await db.send(new PutCommand(studentParams));

   return { success: true, id: data.id };

   } catch (error) {
     console.error('Error creating student or user:', error.message);
     return { success: false, message: 'Error creating student or user', error: error.message };
   }
};

const updateStudent = async (id, data = {}) => {
  const timestamp = new Date().toISOString();

  const existingStudent = await getStudentById(id);

  if (!existingStudent.success) {
    return { success: false, message: 'Student not found, cannot update' };
  }

  const params = {
    TableName: studentTable,
    Item: {
      ...existingStudent.data,
      ...data,
      id: id,
      updatedAt: timestamp
    }
  };


  try {
    if(data.url) 
      await User.updateUserProfileImageUrl(data.id, data.url)
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
      [key]: value
    }
  };

  try {
    const { Item = {} } = await db.send(new GetCommand(params));
    if (Object.keys(Item).length === 0) {
      return { success: false, message: 'Student not found', data: null };
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
      [key]: value
    }
  };

  try {
    await db.send(new DeleteCommand(params));
    return { success: true, message: `Student with ${key} = ${value} deleted successfully` };
  } catch (error) {
    console.error(`Error deleting Student with ${key} = ${value}:`, error.message);
    return { success: false, message: `Error deleting student with ${key} = ${value}`, error: error.message };
  }
};


 
const classAcept = async (currentClass, id) =>{
  const student = await getStudentById(id);
  const timestamp = new Date().toISOString();
  
  let newStudent = {...student}
  if (!student) {
    return{success: false, message: "student not found"}
  }
  const clases = newStudent.data.misClases;
  clases.push(currentClass);
   newStudent.data.misClases = clases

   const params = {
    TableName: studentTable,
    Item: {
      ...student.data,
      ...newStudent.data,
      id: id,
      updatedAt: timestamp
    }
   }
  

try {

    await db.send(new PutCommand(params))
  return { success: true, message: `hour add in my class`};

} catch (error) {
  console.error("error ingresando registrando la clase");
  return { success: false, message: `error in add class`, error: error.message };

}
}
export {
  createStudent,
  updateStudent,
  readAllStudents,
  getStudentById,
  deleteStudentById,
  classAcept
};
