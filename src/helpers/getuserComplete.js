import * as User from '../Models/ModelUser.js';
import * as Teacher from '../Models/ModelTeacher.js';
import * as Student from '../Models/modelStudent.js';


export const getUserComplete = async(id) => {
    const otherUserCognito = await User.getUserById(id);
    let otherUser; 
 
    
    if(otherUserCognito?.data?.role == "teacher"){
      console.log('Retorno esto 1');
     return  otherUser = await Teacher.getTeacherById(otherUserCognito.data.teacherId);

    } else if (otherUserCognito?.data?.role == "student"){
      console.log('Retorno esto 2');
      return  otherUser = await Student.getStudentById(otherUserCognito.data.studentId);
    } else {
      const isTeacher = await Teacher.teacherExists(id)
      if(isTeacher){
        console.log('Retorno esto 3');
        return otherUser = await Teacher.getTeacherById(id);
      }else{
        console.log('Retorno esto 4');
        return  otherUser = await Student.getStudentById(id);
      } 
    }

}