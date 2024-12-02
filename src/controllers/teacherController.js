import * as Teacher from '../Models/ModelTeacher.js';
import { Table } from '../awsconfig/database.js';
import { emailExists } from '../helpers/IsEmailExist.js';

export const createTeacherHandler = async (req, res) => {
    const teacherData = req.body;

    try {
        const result = await Teacher.createTeacher(teacherData);

        if (result.success) {
            // Devolver toda la información del profesor, no solo el id
            return res.status(201).json({
                success: true,
                teacher: {
                    id: result.teacher.id,
                    firstName: result.teacher.firstName,
                    lastName: result.teacher.lastName,
                    email: result.teacher.email
                }
            });
        }

        return res.status(500).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error creating teacher', error: error.message });
    }
};
export const checkTeacherEmailExists = async (req, res) => {
    try {
        const { email } = req.params;
        const result = await emailExists(email, Table);
        return res.status(200).json({ isEmail: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error checking email', error: error.message });
    }
};


export const readAllTeachersHandler = async (req, res) => {
    const result = await Teacher.readAllTeachers();

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(500).json({ success: false, message: result.message });
};

export const getTeacherByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await Teacher.getTeacherById(id);

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const deleteTeacherByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await Teacher.deleteTeacherById(id);

    if (result.success) {
        return res.json({ success: true, message: result.message });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const updateTeacherHandler = async (req, res) => {
    const { id } = req.params;
    const teacherData = req.body;
    const result = await Teacher.updateTeacher(id, teacherData);

    if (result.success) {
        return res.json({ success: true, id });
    }
    return res.status(404).json({ success: false, message: result.message });
};
