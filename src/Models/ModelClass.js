import { db, ClassTable } from '../awsconfig/database.js'
import { PutCommand, ScanCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { createMeeting } from '../controllers/MeetingController.js';



import { ChimeSDKMeetingsClient, CreateMeetingCommand } from "@aws-sdk/client-chime-sdk-meetings";

const chimeClient = new ChimeSDKMeetingsClient({ region: "us-east-1" });

/*const createMeeting = async (meetingData) => {
  try {
    const command = new CreateMeetingCommand(meetingData);
    const response = await chimeClient.send(command);
    return { success: true, meeting: response.Meeting };
  } catch (error) {
    console.error("Error creating meeting:", error);
    return { success: false, error: error.message };
  }
};
*/
const createClass = async (data = {}) => {
  const timestamp = new Date().toISOString();
  const classId = uuidv4();

  // Crear una reunión
 /* const meetingData = {
    ClientRequestToken: uuidv4(), // Un token único para evitar duplicados
    MediaRegion: 'us-east-1', // La región donde se creará la reunión
    ExternalMeetingId: classId // Un identificador externo para la reunión
  };
  
  const meetingResult = await createMeeting(meetingData);
 console.log(meetingResult)
  if (!meetingResult.success) {
    console.error('Error creating meeting:', meetingResult.error);
    return { success: false, message: 'Error creating class', error: meetingResult.error };
  }
*/
  const classParams = {
    TableName: ClassTable,
    Item: {
      id: classId,
      teacherId: data.teacherId,
      studentId: data.studentId,
      date: data.date,
      hours: data.hours,
      status: false,
      createdAt: timestamp,
      meetingId: classId //meetingResult.meeting.MeetingId
    }
  };

  try {
    await db.send(new PutCommand(classParams));
    return { success: true, id: classId };
  } catch (error) {
    console.error('Error creating class:', error.message);
    return { success: false, message: 'Error creating class', error: error.message };
  }
};


const updateClass = async (id, data = {}) => {
    const timestamp = new Date().toISOString();
    const existingClass = await getClassById(id);

    if (!existingClass.success) {
        return { success: false, message: 'Class not found, cannot update' };
    }

    const classParams = {
        TableName: ClassTable,
        Item: {
            ...existingClass.data,
            ...data,
            id: id,
            updateAt: timestamp
        }
    }

    try {
        await db.send(new PutCommand(classParams));
        return { success: true, id: id }
    } catch (error) {
        console.error('Error updating class ', error.message);
        return { success: false, message: 'Error updating class ', error: error.message }
    }

}

const readAllClass = async () => {
    const params = {
        TableName: ClassTable
    };

    try {
        const { Items = [] } = await db.send(new ScanCommand(params));
        return { success: true, data: Items }
    } catch (error) {
        console.error('Error reading all classes: ', error.message);
        return { success: false, message: 'Error reading all classes ', error: error.message, data: null }
    }
}

const getClassById = async (value, key = 'id') => {
    const params = {
        TableName: ClassTable,
        Key: {
            [key]: value
        }
    };
    try {
        const { Item = {} } = await db.send(new GetCommand(params));
        if (Object.keys(Item).length === 0) {
            return { success: false, message: 'Class not found', data: null };
        }
        return { success: true, data: Item };
    } catch (error) {
        console.error(`Error reading Class with ${key} = ${value}:`, error.message);
        return { success: false, message: `Error reading Class with ${key} = ${value}`, error: error.message, data: null };
    }
}

const deleteClassById = async (value, key = 'id') => {
    const params = {
        TableName: ClassTable,
        Key: {
            [key]: value
        }
    };

    try {
        await db.send(new DeleteCommand(params));
        return { success: true, message: `Class with ${key} = ${value} deleted successfully` };
    } catch (error) {
        console.error(`Error deleting Class with ${key} = ${value}:`, error.message);
        return { success: false, message: `Error deleting Class with ${key} = ${value}`, error: error.message };
    }
};


const classExist = async (id) => {
    const result = await getClassById(id);
    return result.success;
};

const getClassesByTeacherId = async (teacherId) => {
    const params = {
        TableName: ClassTable,
        FilterExpression: "teacherId = :teacherId",
        ExpressionAttributeValues: {
            ":teacherId": teacherId
        }
    };

    try {
        const { Items = [] } = await db.send(new ScanCommand(params));
        return { success: true, data: Items };
    } catch (error) {
        console.error(`Error fetching classes for teacherId ${teacherId}:`, error.message);
        return { success: false, message: `Error fetching classes for teacherId ${teacherId}`, error: error.message, data: null };
    }
};

const getClassesByStudentId = async (studentId) => {
    const params = {
        TableName: ClassTable,
        FilterExpression: "studentId = :studentId",
        ExpressionAttributeValues: {
            ":studentId": studentId
        }
    };

    try {
        const { Items = [] } = await db.send(new ScanCommand(params));
        return { success: true, data: Items };
    } catch (error) {
        console.error(`Error fetching classes for studentId ${studentId}:`, error.message);
        return { success: false, message: `Error fetching classes for studentId ${studentId}`, error: error.message, data: null };
    }
};

export {
    createClass,
    updateClass,
    readAllClass,
    getClassById,
    deleteClassById,
    classExist,
    getClassesByTeacherId,
    getClassesByStudentId
};
