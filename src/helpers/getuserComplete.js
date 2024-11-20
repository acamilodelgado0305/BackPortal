import * as User from '../Models/ModelUser.js';
import * as Teacher from '../Models/ModelTeacher.js';
import * as Student from '../Models/modelStudent.js';


export const getUserComplete = async(id) => {
    const otherUserCognito = await User.getUserById(id);
    let otherUser; 

    if(otherUserCognito.data.role == "teacher"){
     return  otherUser = await Teacher.getTeacherById(otherUserCognito.data.teacherId);
    } else if (otherUserCognito.data.role == "student"){
      return  otherUser = await Student.getStudentById(otherUserCognito.data.studentId);
    } else {
      console.log('Este es el usuario que estoy devolviendo')
      return  otherUserCognito
    }

}