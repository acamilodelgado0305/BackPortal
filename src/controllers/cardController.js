import * as ModelCard from '../Models/ModelCard.js';

export const createCardHandler = async (req, res) => {
    const { userId, ...cardData } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const result = await ModelCard.createCardRecord(cardData, userId);
        if (result.success) {
            return res.status(201).json({ success: true, message: result.message });
        }
        return res.status(500).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating card record',
            error: error.message,
        });
    }
};

export const getCardsByUserHandler = async (req, res) => {
    const { userId } = req.params; // Obtén el userId desde los parámetros de la URL

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const result = await ModelCard.getCardsByUser(userId); // Llama al modelo para obtener las tarjetas
        if (result.success) {
            return res.status(200).json({ success: true, data: result.data });
        }
        return res.status(404).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving cards',
            error: error.message,
        });
    }
};


export const updateCardHandler = async (req, res) => {
    const { id } = req.params;
    const { userId, ...updateData } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const result = await ModelCard.updateCardRecord(id, userId, updateData);
        if (result.success) {
            return res.json({ success: true, data: result.data });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating card record',
            error: error.message,
        });
    }
};

export const deleteCardHandler = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const result = await ModelCard.deleteCardRecord(id, userId);
        if (result.success) {
            return res.json({ success: true, message: result.message });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting card record',
            error: error.message,
        });
    }
};
