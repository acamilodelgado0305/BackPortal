import * as User from '../Models/ModelUser.js';

export const createUserHandler = async (req, res) => {
    const userData = req.body;
    const result = await User.createUser(userData);

    if (result.success) {
        return res.status(201).json({ success: true, id: result.id });
    }
    return res.status(500).json({ success: false, message: result.message });
};

export const readAllUsersHandler = async (req, res) => {
    const result = await User.readAllUsers();

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(500).json({ success: false, message: result.message });
};

export const getUserByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await User.getUserById(id);

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const deleteUserByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await User.deleteUserById(id);

    if (result.success) {
        return res.json({ success: true, message: result.message });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const updateUserHandler = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    const result = await User.updateUser(id, userData);

    if (result.success) {
        return res.json({ success: true, id });
    }
    return res.status(404).json({ success: false, message: result.message });
};
