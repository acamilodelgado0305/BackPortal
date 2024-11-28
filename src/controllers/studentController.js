import * as student from '../Models/modelStudent.js';

export const createstudentHandler = async (req, res) => {
    const studentData = req.body;

    const result = await student.createStudent(studentData);

    if (result.success) {
        return res.status(201).json({ success: true, id: result.id });
    }
    return res.status(500).json({ success: false, message: result.message });
};

export const readAllstudentsHandler = async (req, res) => {
    const result = await student.readAllStudents();

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(500).json({ success: false, message: result.message });
};

export const getstudentByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await student.getStudentById(id);

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const deletestudentByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await student.deleteStudentById(id);

    if (result.success) {
        return res.json({ success: true, message: result.message });
    }
    return res.status(404).json({ success: false, message: result.message });
};


export const updatestudentHandler = async (req, res) => {
    const { id } = req.params;
    const studentData = req.body;
    const result = await student.updateStudent(id, studentData);

    if (result.success) {
        return res.json({ success: true, id });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const classAceptHandler = async (req, res) => {
   const studentId = req.params.id;
   const classHour= req.body;

   const addClass = await student.classAcept(classHour, studentId)
   if (addClass.success) {
    return res.json({success: true, studentId, data:addClass.data})
   }
   return res.status(500).json({success: false, message:addClass.message})
   
}
