import express from "express";
import { 
  getFacultyProfile, 
  getStudentsBySemester,
  markAttendance,
  updateMarks,
  getSubjectMarksData,
  getFacultySubjects
} from "../controllers/facultyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getFacultyProfile);
router.get("/students/:semester", protect, getStudentsBySemester);
router.post("/mark-attendance", protect, markAttendance);
router.post("/update-marks", protect, updateMarks);
router.get("/subject-marks/:subjectId", protect, getSubjectMarksData);
router.get("/faculty-subjects", protect, getFacultySubjects)

export default router;