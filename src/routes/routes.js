import express from "express";
import {
  createTeacher,
  updateTeacher,
  deleteTeacherById,
  getTeacherById,
  readAllTeachers,
} from "../Models/ModelTeacher.js";

const router = express.Router();

// Create Teacher
router.post("/teachers", async (req, res) => {
    const teacher = req.body;
    const { success, id, message } = await createTeacher(teacher);
  
    if (success) {
      return res.json({ success, id });
    }
  
    return res.status(500).json({ success: false, message });
  });
  

// READ ALL Teacher
router.get("/teachers", async (req, res) => {
  const { success, data } = await readAllTeachers();

  if (success) {
    return res.json({ success, data });
  }
  return res.status(500).json({ success: false, messsage: "Error" });
});

// Get Teacher by ID
router.get("/teachers/:id", async (req, res) => {
  const { id } = req.params;
  const { success, data } = await getTeacherById(id);
  console.log(data);
  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

// Delete Teacher by Id
router.delete("/teachers/:id", async (req, res) => {
  const { id } = req.params;
  const { success, data } = await deleteTeacherById(id);
  if (success) {
    return res.json({ success, data });
  }
  return res.status(500).json({ success: false, message: "Error" });
});

export default router;

// Update Taacher by ID
router.put("/teachers/:id", async (req, res) => {
    const teacher = req.body;
    const { id } = req.params;
  
    const { success, message } = await updateTeacher(id, teacher);
  
    if (success) {
      return res.json({ success, id });
    }
  
    return res.status(500).json({ success: false, message });
  });
  
