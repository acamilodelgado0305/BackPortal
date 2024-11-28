import * as User from '../Models/ModelUser.js';
import * as Teacher from '../Models/ModelTeacher.js';
import * as Student from '../Models/modelStudent.js';


export const getUserComplete = async(id) => {
    console.log('ESTE ES EL ID QUE Llegó a getUserComplete '+id);
     otherUserCognito = await User.getUserById(id);
    console.log('Esto es lo que devuelve '+JSON.stringify(otherUserCognito))
     return otherUserCognito.data
    /*
    if(otherUserCognito?.data?.role == "teacher"){
     return  otherUser = await Teacher.getTeacherById(otherUserCognito.data.teacherId);

    } else if (otherUserCognito?.data?.role == "student"){
      return  otherUser = await Student.getStudentById(otherUserCognito.data.studentId);
    } else {
      const isTeacher = await Teacher.teacherExists(id)
      if(isTeacher){
        return otherUser = await Teacher.getTeacherById(id);
      }else{
        return  otherUser = await Student.getStudentById(id);
      } 
    } */

}