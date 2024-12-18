import express from "express";
import teacherRoutes from "./teachers.routes.js";
import userRoutes from "./user.routes.js";
import students from "./students.routes.js";
import standardMessages from "./standardMessage.routes.js";
import classReservation from "./classReservation.routes.js"
import classes from "./class.routes.js"

const router = express.Router();

router.use("/teachers", teacherRoutes);
router.use("/users", userRoutes);
router.use("/students", students);
router.use("/standardMessages", standardMessages);
router.use("/clases", classReservation);

router.use("/clases", classes);


export default router;