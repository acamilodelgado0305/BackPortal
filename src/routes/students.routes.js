import express from "express";
import * as studentControllers from "../controllers/studentController.js"; 

const router = express.Router();

router.post("/", studentControllers.createstudentHandler);
router.get("/", studentControllers.readAllstudentsHandler);
router.get("/:id", studentControllers.getstudentByIdHandler);
router.delete("/:id", studentControllers.deletestudentByIdHandler);
router.put("/:id", studentControllers.updatestudentHandler);
router.put("/addclass/:id", studentControllers.classAceptHandler);

export default router;