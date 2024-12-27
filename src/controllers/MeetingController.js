import { v4 as uuidv4 } from "uuid";
import {
    CreateMeetingCommand,
    CreateAttendeeCommand,
    GetMeetingCommand,
    DeleteMeetingCommand,
    DeleteAttendeeCommand,
    ListAttendeesCommand,
    UpdateAttendeeCapabilitiesCommand,
} from "@aws-sdk/client-chime-sdk-meetings";
import chimeClient from "../awsconfig/chimeClient.js";

// Almacenamiento en memoria para reuniones y sus detalles
const meetings = {};
const attendees = {};

// Crear una reunión con opciones avanzadas
export const createMeeting = async (req, res) => {
    const { externalUserId, meetingName, maxAttendees = 250, record = false } = req.body;

    if (!externalUserId) {
        return res.status(400).json({ error: "El parámetro externalUserId es obligatorio" });
    }

    try {
        const meetingParams = {
            ClientRequestToken: uuidv4(),
            MediaRegion: "us-east-1",
            ExternalMeetingId: `${Date.now()}`,
            MeetingFeatures: {
                Audio: { EchoReduction: "AVAILABLE" },
                Video: { MaxResolution: "HD" },
            },
            MaxAttendees: maxAttendees,
        };

        const createMeetingCommand = new CreateMeetingCommand(meetingParams);
        const meetingResponse = await chimeClient.send(createMeetingCommand);

        // Guardar información detallada de la reunión
        meetings[meetingResponse.Meeting.MeetingId] = {
            ...meetingResponse.Meeting,
            name: meetingName,
            createdAt: new Date().toISOString(),
            createdBy: externalUserId,
            isRecording: record,
            attendees: {},
        };

        // Crear asistente para el creador con roles de moderador
        const attendeeParams = {
            MeetingId: meetingResponse.Meeting.MeetingId,
            ExternalUserId: externalUserId,
            Capabilities: {
                Audio: "SendReceive",
                Video: "SendReceive",
                Content: "SendReceive",
            }
        };

        const createAttendeeCommand = new CreateAttendeeCommand(attendeeParams);
        const attendeeResponse = await chimeClient.send(createAttendeeCommand);

        // Guardar información del asistente
        meetings[meetingResponse.Meeting.MeetingId].attendees[externalUserId] = {
            ...attendeeResponse.Attendee,
            role: 'moderator',
            joinedAt: new Date().toISOString()
        };

        res.status(201).json({
            meeting: meetingResponse.Meeting,
            attendee: attendeeResponse.Attendee,
            message: "Reunión creada exitosamente",
        });
    } catch (error) {
        console.error("Error creating meeting:", error);
        res.status(500).json({ error: "Error al crear la reunión", details: error.message });
    }
};

// Unirse a una reunión con validaciones adicionales
export const joinMeeting = async (req, res) => {
    const { meetingId, externalUserId, name } = req.body;

    if (!meetingId || !externalUserId) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    try {
        // Verificar si la reunión existe y tiene espacio
        const meeting = meetings[meetingId];
        if (!meeting) {
            return res.status(404).json({ error: "Reunión no encontrada" });
        }

        const attendeeCount = Object.keys(meeting.attendees).length;
        if (attendeeCount >= meeting.MaxAttendees) {
            return res.status(403).json({ error: "La reunión está llena" });
        }

        // Verificar si el usuario ya está en la reunión
        if (meeting.attendees[externalUserId]) {
            return res.status(400).json({ error: "Ya eres parte de esta reunión" });
        }

        const attendeeParams = {
            MeetingId: meetingId,
            ExternalUserId: externalUserId,
            Capabilities: {
                Audio: "SendReceive",
                Video: "SendReceive",
                Content: "Receive",
            }
        };

        const command = new CreateAttendeeCommand(attendeeParams);
        const response = await chimeClient.send(command);

        // Guardar información del nuevo asistente
        meetings[meetingId].attendees[externalUserId] = {
            ...response.Attendee,
            name: name || externalUserId,
            role: 'participant',
            joinedAt: new Date().toISOString()
        };

        res.status(201).json({
            meeting: meeting,
            attendee: response.Attendee,
            message: "Te has unido a la reunión exitosamente",
        });
    } catch (error) {
        console.error("Error joining meeting:", error);
        res.status(500).json({ error: "Error al unirse a la reunión", details: error.message });
    }
};

// Obtener lista de participantes de una reunión
export const listAttendees = async (req, res) => {
    const { meetingId } = req.params;

    if (!meetingId) {
        return res.status(400).json({ error: "El ID de la reunión es requerido" });
    }

    try {
        const command = new ListAttendeesCommand({ MeetingId: meetingId });
        const response = await chimeClient.send(command);

        res.status(200).json({
            attendees: response.Attendees,
            message: "Lista de participantes obtenida exitosamente"
        });
    } catch (error) {
        console.error("Error listing attendees:", error);
        res.status(500).json({ error: "Error al listar participantes", details: error.message });
    }
};

// Remover un participante de la reunión
export const removeAttendee = async (req, res) => {
    const { meetingId, attendeeId } = req.params;
    const { requesterId } = req.body;

    if (!meetingId || !attendeeId) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    try {
        // Verificar si el solicitante es moderador
        const meeting = meetings[meetingId];
        if (!meeting?.attendees[requesterId]?.role === 'moderator') {
            return res.status(403).json({ error: "No tienes permisos para realizar esta acción" });
        }

        const command = new DeleteAttendeeCommand({
            MeetingId: meetingId,
            AttendeeId: attendeeId
        });

        await chimeClient.send(command);

        // Eliminar al participante de nuestro registro
        delete meetings[meetingId].attendees[attendeeId];

        res.status(200).json({
            message: "Participante removido exitosamente"
        });
    } catch (error) {
        console.error("Error removing attendee:", error);
        res.status(500).json({ error: "Error al remover participante", details: error.message });
    }
};

// Finalizar una reunión
export const endMeeting = async (req, res) => {
    const { meetingId } = req.params;
    const { requesterId } = req.body;

    if (!meetingId) {
        return res.status(400).json({ error: "El ID de la reunión es requerido" });
    }

    try {
        // Verificar si el solicitante es el creador o moderador
        const meeting = meetings[meetingId];
        if (meeting.createdBy !== requesterId &&
            !meeting?.attendees[requesterId]?.role === 'moderator') {
            return res.status(403).json({ error: "No tienes permisos para finalizar la reunión" });
        }

        const command = new DeleteMeetingCommand({ MeetingId: meetingId });
        await chimeClient.send(command);

        // Eliminar la reunión de nuestro registro
        delete meetings[meetingId];

        res.status(200).json({
            message: "Reunión finalizada exitosamente"
        });
    } catch (error) {
        console.error("Error ending meeting:", error);
        res.status(500).json({ error: "Error al finalizar la reunión", details: error.message });
    }
};

// Actualizar capacidades de un participante (mute/unmute, enable/disable video)
export const updateAttendeeCapabilities = async (req, res) => {
    const { meetingId, attendeeId } = req.params;
    const { requesterId, capabilities } = req.body;

    if (!meetingId || !attendeeId || !capabilities) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    try {
        // Verificar si el solicitante es moderador
        const meeting = meetings[meetingId];
        if (!meeting?.attendees[requesterId]?.role === 'moderator') {
            return res.status(403).json({ error: "No tienes permisos para realizar esta acción" });
        }

        const command = new UpdateAttendeeCapabilitiesCommand({
            MeetingId: meetingId,
            AttendeeId: attendeeId,
            Capabilities: capabilities
        });

        await chimeClient.send(command);

        // Actualizar capacidades en nuestro registro
        meetings[meetingId].attendees[attendeeId].capabilities = capabilities;

        res.status(200).json({
            message: "Capacidades actualizadas exitosamente",
            capabilities: capabilities
        });
    } catch (error) {
        console.error("Error updating capabilities:", error);
        res.status(500).json({ error: "Error al actualizar capacidades", details: error.message });
    }
};

// Obtener estado de la reunión
export const getMeetingStatus = async (req, res) => {
    const { meetingId } = req.params;

    if (!meetingId) {
        return res.status(400).json({ error: "El ID de la reunión es requerido" });
    }

    try {
        const meeting = meetings[meetingId];
        if (!meeting) {
            return res.status(404).json({ error: "Reunión no encontrada" });
        }

        const attendeeCount = Object.keys(meeting.attendees).length;
        const duration = new Date() - new Date(meeting.createdAt);
        const durationMinutes = Math.floor(duration / 1000 / 60);

        res.status(200).json({
            meetingName: meeting.name,
            createdAt: meeting.createdAt,
            duration: durationMinutes,
            attendeeCount: attendeeCount,
            isRecording: meeting.isRecording,
            createdBy: meeting.createdBy
        });
    } catch (error) {
        console.error("Error getting meeting status:", error);
        res.status(500).json({ error: "Error al obtener estado de la reunión", details: error.message });
    }
};