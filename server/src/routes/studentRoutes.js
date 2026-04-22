import express from "express";
import { getStudentDashboard } from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getRiskStudents } from "../controllers/studentController.js";

const router = express.Router();

router.get("/dashboard", protect, getStudentDashboard);
router.get("/risk-students", getRiskStudents);

export default router;  