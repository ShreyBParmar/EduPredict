import express from "express";
import { 
  getFacultyProfile, 
  getStudentsBySemester,
  markAttendance
} from "../controllers/facultyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getFacultyProfile);
router.get("/students/:semester", protect, getStudentsBySemester);
router.post("/mark-attendance", protect, markAttendance);

export default router;