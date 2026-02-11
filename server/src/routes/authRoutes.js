import express from "express";
import { login, registerFaculty, registerStudent, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register_student", registerStudent);
router.post("/register_faculty",registerFaculty)
/*
router.post('/login_student',loginStudent);
router.post('/login_faculty',loginFaculty);
*/
router.post("/login", login)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token", resetPassword);

export default router;
