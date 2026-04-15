import express from "express"
const router = express.Router();
import Subject from "../models/MasterSubject.js"

// ✅ GET subjects by semester
router.get("/subjects", async (req, res) => {
  try {
    const { sem } = req.query;

    const subjects = await Subject.find({ semester: Number(sem) });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    res.status(400).json({message: "Internal error"})
  }
});

export default router;