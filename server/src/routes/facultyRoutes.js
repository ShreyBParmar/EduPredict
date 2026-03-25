import express from "express";
import { getFacultyProfile } from "../controllers/facultyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getFacultyProfile);

export default router;