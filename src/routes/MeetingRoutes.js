import express from "express";
import { createMeeting, joinMeeting } from "../controllers/MeetingController.js";

const router = express.Router();

// Ruta para crear una reunión
router.post("/create-meeting", createMeeting);

// Ruta para unirse a una reunión
router.post("/join-meeting", joinMeeting);

export default router;
