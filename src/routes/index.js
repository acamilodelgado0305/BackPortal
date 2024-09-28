import express from "express";
import teacherRoutes from "./teachers.routes.js";

const router = express.Router();

router.use("/teachers", teacherRoutes);

export default router;
