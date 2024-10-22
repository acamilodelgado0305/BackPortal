import * as Teacher from '../Models/ModelTeacher.js';
import bcrypt from 'bcrypt';

export const createTeacherHandler = async (req, res) => {
    const teacherData = req.body;
    try {
        if (teacherData.password) {
            const salt = await bcrypt.genSalt(10);
            teacherData.password = await bcrypt.hash(teacherData.password, salt);
        }

        const result = await Teacher.createTeacher(teacherData);

        if (result.success) {
            return res.status(201).json({ success: true, id: result.id });
        }
        return res.status(500).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error creating teacher', error: error.message });
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
