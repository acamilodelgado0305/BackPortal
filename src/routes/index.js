import express from "express";
import teacherRoutes from "./teachers.routes.js";
import userRoutes from "./user.routes.js";
import students from "./students.routes.js";
import standardMessages from "./standardMessage.routes.js";
import classReservation from "./classReservation.routes.js"
import classes from "./class.routes.js"
import meeting from "./MeetingRoutes.js"
import transactionRoutes from "./transactionRoutes.js";
import card from "./cardRoutes.js"
import paymentRoutes from "./payment.routes.js";
import usersLanding from "./usersLandingRoutes.js"
const router = express.Router();

router.use("/teachers", teacherRoutes);
router.use("/users", userRoutes);
router.use("/students", students);
router.use("/standardMessages", standardMessages);
router.use("/clases", classes);
router.use("/chime", meeting);
router.use("/transactions", transactionRoutes);
router.use("/card", card);
router.use("/usersLanding", usersLanding);
router.use("/payments", paymentRoutes);

export default router;