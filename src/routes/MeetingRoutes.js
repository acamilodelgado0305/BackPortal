import express from "express";
import { 
    createMeeting, 
    joinMeeting,
    listAttendees,
    removeAttendee,
    endMeeting,
    updateAttendeeCapabilities,
    getMeetingStatus
} from "../controllers/MeetingController.js";

const router = express.Router();

// Rutas para gestión de reuniones
router.post("/create-meeting", createMeeting);
router.post("/join-meeting", joinMeeting);
router.delete("/meetings/:meetingId", endMeeting);
router.get("/meetings/:meetingId/status", getMeetingStatus);

// Rutas para gestión de participantes
router.get("/meetings/:meetingId/attendees", listAttendees);
router.delete("/meetings/:meetingId/attendees/:attendeeId", removeAttendee);
router.patch("/meetings/:meetingId/attendees/:attendeeId/capabilities", updateAttendeeCapabilities);

export default router;