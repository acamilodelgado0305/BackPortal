import express from "express";
import *  as classController from "../controllers/classController.js"

const router = express.Router();
// api/classes
router.post("/", classController.createClassHandler);
router.get("/", classController.readAllClassesHandler);
router.get("/:id", classController.getClassByIdHandler);
router.get("/teacherId/:teacherId", classController.getClassesByTeacherIdHandler);
router.get("/studentId/:studentId", classController.getClassesByStudentIdHandler);
router.delete("/:id", classController.deleteClassByIdHandler);
router.put("/:id", classController.updateClassHandler);


export default router;