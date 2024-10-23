import express from "express";
import * as teachersController from "../controllers/teacherController.js";

const router = express.Router();

router.post("/", teachersController.createTeacherHandler);
router.get("/", teachersController.readAllTeachersHandler);
router.get("/:id", teachersController.getTeacherByIdHandler);
router.delete("/:id", teachersController.deleteTeacherByIdHandler);
router.put("/:id", teachersController.updateTeacherHandler);

router.get("/email/:email",teachersController.checkTeacherEmailExists);

export default router;
