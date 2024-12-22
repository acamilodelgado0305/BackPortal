import { v4 as uuidv4 } from "uuid";
import {
    CreateMeetingCommand,
    CreateAttendeeCommand,
    GetMeetingCommand,
} from "@aws-sdk/client-chime-sdk-meetings";
import chimeClient from "../awsconfig/chimeClient.js";

const meetings = {};

// Crear una reunión
export const createMeeting = async (req, res) => {
    const { externalUserId } = req.body;

    if (!externalUserId) {
        return res.status(400).json({ error: "El parámetro externalUserId es obligatorio" });
    }

    try {
        // Crear reunión
        const meetingParams = {
            ClientRequestToken: `token-${Date.now()}`,
            MediaRegion: "us-east-1",
            ExternalMeetingId: `${Date.now()}`,
        };

        const createMeetingCommand = new CreateMeetingCommand(meetingParams);
        const meetingResponse = await chimeClient.send(createMeetingCommand);

        // Guardar la información de la reunión en memoria
        meetings[meetingResponse.Meeting.MeetingId] = meetingResponse.Meeting;

        // Crear asistente para el creador
        const attendeeParams = {
            MeetingId: meetingResponse.Meeting.MeetingId,
            ExternalUserId: externalUserId,
        };

        const createAttendeeCommand = new CreateAttendeeCommand(attendeeParams);
        const attendeeResponse = await chimeClient.send(createAttendeeCommand);

        res.status(201).json({
            meeting: meetingResponse.Meeting,
            attendee: attendeeResponse.Attendee,
            message: "Reunión y asistente del creador creados exitosamente",
        });
    } catch (error) {
        console.error("Error creating meeting or attendee:", error);
        res.status(500).json({ error: "Error al crear la reunión o el asistente", details: error.message });
    }
};

// Unirse a una reunión
export const joinMeeting = async (req, res) => {
    const { meetingId, externalUserId } = req.body;

    if (!meetingId || !externalUserId) {
        return res.status(400).json({ error: "Faltan parámetros: meetingId y externalUserId son obligatorios" });
    }

    try {
        // Obtener información de la reunión
        let meeting;
        try {
            const getMeetingCommand = new GetMeetingCommand({ MeetingId: meetingId });
            const meetingResponse = await chimeClient.send(getMeetingCommand);
            meeting = meetingResponse.Meeting;
        } catch (error) {
            console.error("Error getting meeting:", error);
            return res.status(404).json({ error: "No se encontró la reunión especificada" });
        }

        // Crear nuevo asistente
        const attendeeParams = {
            MeetingId: meetingId,
            ExternalUserId: externalUserId,
        };

        const command = new CreateAttendeeCommand(attendeeParams);
        const response = await chimeClient.send(command);

        res.status(201).json({
            meeting: meeting,
            attendee: response.Attendee,
            message: "Asistente invitado creado exitosamente",
        });
    } catch (error) {
        console.error("Error creating attendee:", error);
        res.status(500).json({ error: "Error al crear el asistente invitado", details: error.message });
    }
};