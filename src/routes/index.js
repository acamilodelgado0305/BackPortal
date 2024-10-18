import express from "express";
import teacherRoutes from "./teachers.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use("/teachers", teacherRoutes);
router.use("/users", userRoutes);

export default router;