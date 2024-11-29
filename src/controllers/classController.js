import * as Class from "../Models/ModelClass.js"

export const createClassHandler = async (req, res) =>{
    const classData = req.body;
    try{
        const result = await Class.createClass(classData);
        if(result.success) {
            return res.status(201).json({success:true, id: result.id});
        }
        return res.status(500).json({success:false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error creating Class', error: error.message });
    }

}

export const readAllClassesHandler = async (req, res) => {
    const result = await Class.readAllClass();

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(500).json({ success: false, message: result.message });
};

export const getClassByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await Class.getClassById(id);

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const deleteClassByIdHandler = async(req, res) =>{
    const { id } = req.params;
    const result = await Class.deleteClassById(id);
    if (result.success) {
        return res.json({ success: true, message: result.message });
    }
    return res.status(404).json({ success: false, message: result.message });

}

export const updateClassHandler = async (req, res) => {
    const { id } = req.params;
    const classData = req.body;
    const result = await Class.updateClass(id, classData);

    if (result.success) {
        return res.json({ success: true, id });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const getClassesByTeacherIdHandler = async (req, res) => {
    const { teacherId } = req.params; 
    try {
        const result = await Class.getClassesByTeacherId(teacherId);

        if (result.success) {
            return res.json({ success: true, data: result.data });
        }
        return res.status(404).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching classes for teacher', error: error.message });
    }
};

export const getClassesByStudentIdHandler = async (req, res) => {
    const { studentId } = req.params; 
    try {
        const result = await Class.getClassesByStudentId(studentId);

        if (result.success) {
            return res.json({ success: true, data: result.data });
        }
        return res.status(404).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching classes for student', error: error.message });
    }
};
