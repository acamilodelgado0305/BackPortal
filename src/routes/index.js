import express from "express";
import teacherRoutes from "./teachers.routes.js";
import students from "./students.routes.js";

const router = express.Router();

router.use("/teachers", teacherRoutes);
router.use("/students", students);

export default router;
