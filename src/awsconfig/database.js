import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv'

let db;
const Table = "teacher_portal";
const UserTable = "users-Esturio"
const studentTable = "student_portal";
const standardMessagesTable = 'standard-Messages-esturio';
const ClassTable = "classes-Esturio";
const class_reservations = "class_reservations";
const TransactionTable = "transactions_esturio";
const CardTable = "card-user"
const UsersLanding = "users_landing"
dotenv.config()

try {
  // Validar credenciales antes de crear el cliente
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('Credenciales de AWS no están configuradas. Verifique las variables de entorno.');
  }

  // Configuración del cliente DynamoDB
  const client = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  // Crear el cliente DynamoDB Document
  db = DynamoDBDocumentClient.from(client);
  console.log('Conexión exitosa a DynamoDB');
} catch (error) {
  console.error('Error al configurar la conexión con DynamoDB:', error.message);
  // Propagar el error para detener la ejecución si es necesario
  throw new Error('No se pudo conectar a DynamoDB. Deteniendo la aplicación.');
}

export {
  db,
  UserTable,
  Table,
  studentTable,
  standardMessagesTable,
  ClassTable,
  class_reservations,
  TransactionTable,
  CardTable,
  UsersLanding
  
};
