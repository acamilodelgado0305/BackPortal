import express from "express";
import * as classReservation from "../controllers/classReservationController.js"; 

const router = express.Router();

router.post("/", classReservation.createClassHandler);
router.get("/", classReservation.readAllClassReservationsHandler);
router.get("/:id", classReservation.getClassReservationByIdHandler);
router.get("/currentreservation/:id", classReservation.getClassReservationCurrentByIdHandler);
router.get("/student/:id/:teacherid", classReservation.getClassReservationCurrentByIdHandlerStudent);
router.delete("/:id", classReservation.deleteClassReservationByIdHandler);
router.put("/:id", classReservation.updateClassReservationHandler);

export default router;