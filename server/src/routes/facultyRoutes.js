import express from "express";
import { 
  getFacultyProfile, 
  getStudentsBySemester,
  markAttendance,
  updateMarks,
  getSubjectMarksData
} from "../controllers/facultyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getFacultyProfile);
router.get("/students/:semester", protect, getStudentsBySemester);
router.post("/mark-attendance", protect, markAttendance);
router.post("/update-marks", protect, updateMarks);
router.get("/subject-marks/:subjectId", protect, getSubjectMarksData);

export default router;