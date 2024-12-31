import * as Transaction from '../Models/ModelTransaction.js';

export const createTransactionHandler = async (req, res) => {
    const transactionData = req.body;

    try {
        const result = await Transaction.createTransaction(transactionData);
        if (result.success) {
            return res.status(201).json({ success: true, id: result.id });
        }
        return res.status(500).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating transaction',
            error: error.message,
        });
    }
};

export const getAllTransactionsHandler = async (req, res) => {
    try {
        const result = await Transaction.getAllTransactions();
        if (result.success) {
            return res.json({ success: true, data: result.data });
        }
        return res.status(500).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message,
        });
    }
};

export const getTransactionByIdHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Transaction.getTransactionById(id);
        if (result.success) {
            return res.json({ success: true, data: result.data });
        }
        return res.status(404).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching transaction',
            error: error.message,
        });
    }
};

export const deleteTransactionByIdHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Transaction.deleteTransactionById(id);
        if (result.success) {
            return res.json({ success: true, message: result.message });
        }
        return res.status(404).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting transaction',
            error: error.message,
        });
    }
};

export const getTransactionsByStudentIdHandler = async (req, res) => {
    const { studentId } = req.params;

    try {
        const result = await Transaction.getTransactionsByStudentId(studentId);
        if (result.success) {
            return res.json({ success: true, data: result.data });
        }
        return res.status(404).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching transactions for student',
            error: error.message,
        });
    }
};
export const getTransactionsByTeacherIdHandler = async (req, res) => {
    const { teacherId } = req.params;

    try {
        const result = await Transaction.getTransactionsByTeacherId(teacherId);
        if (result.success) {
            return res.json({ success: true, data: result.data });
        }
        return res.status(404).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching transactions for teacher',
            error: error.message,
        });
    }
};
