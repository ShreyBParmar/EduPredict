import express from "express"
const router = express.Router();
import MasterSubject from "../models/MasterSubject.js"

// ✅ GET subjects by semester
router.get("/subjects", async (req, res) => {
  try {
    const { sem } = req.query;

    if (!sem) {
      return res.status(400).json({ message: "Semester is required" });
    }

    const semester = Number(sem);

    if (isNaN(semester)) {
      return res.status(400).json({ message: "Invalid semester" });
    }

    const subjects = await MasterSubject.find({ semester });

    res.json(subjects);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;