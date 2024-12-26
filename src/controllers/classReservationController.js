import * as classReservations from '../Models/classReservation.js';

export const createClassHandler = async (req, res) => {
    try {
        const classReservation = req.body;

        // Validar datos básicos
        if (!classReservation || Object.keys(classReservation).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Los datos de la reserva de clase no pueden estar vacíos.',
            });
        }

        const result = await createClass(classReservation);

        if (result.success) {
            return res.status(201).json({ success: true, id: result.id });
        }

        return res.status(500).json({
            success: false,
            message: result.message,
            details: result.details,
        });
    } catch (error) {
        console.error('Unhandled error in createClassHandler:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error inesperado al crear la reserva de clase.',
            details: error.message,
        });
    }
};

export const readAllClassReservationsHandler = async (req, res) => {
    const result = await classReservations.readAllReservationClass();

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(500).json({ success: false, message: result.message });
};

export const getClassReservationByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await classReservations.getClassReservationById(id);

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: result.message });
};
export const getClassReservationCurrentByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await classReservations.getClassReservationCurrentById(id);

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: result.message });
};
export const getClassReservationCurrentByIdHandlerStudent = async (req, res) => {
    const { id, teacherid } = req.params;
    const result = await classReservations.getClassReservationCurrentByIdStudent(id, teacherid);

    if (result.success) {
        return res.json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const deleteClassReservationByIdHandler = async (req, res) => {
    const { id } = req.params;
    const result = await classReservations.deleteClassReservationById(id);

    if (result.success) {
        return res.json({ success: true, message: result.message });
    }
    return res.status(404).json({ success: false, message: result.message });
};

export const updateClassReservationHandler = async (req, res) => {
    const { id } = req.params;
    const classReservationsData = req.body;
    const result = await classReservations.updateClassReservation(id, classReservationsData);

    if (result.success) {
        return res.json({ success: true, id });
    }
    return res.status(404).json({ success: false, message: result.message });
};
