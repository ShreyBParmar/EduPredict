import express from "express";
import { getStudentDashboard } from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getStudentDashboard);

export default router;