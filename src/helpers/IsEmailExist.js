import { db } from '../awsconfig/database.js'; 
import { ScanCommand } from '@aws-sdk/lib-dynamodb';


// Verificar si el correo ya está registrado
export const emailExists = async (email, table) => {
    const params = {
      TableName: table,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };
  
    try {
      const { Items } = await db.send(new ScanCommand(params));
      return Items.length > 0;  // Retorna true si hay algún usuario con ese correo
    } catch (error) {
      console.error('Error checking email existence:', error.message);
      throw new Error('Error checking email');
    }
  };