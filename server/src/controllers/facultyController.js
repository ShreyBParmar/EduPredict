import Faculty from "../models/Faculty.js";

export const getFacultyProfile = async (req, res) => {
  try {

    const facultyId = req.user.refId;

    const faculty = await Faculty.findById(facultyId);

    res.json({
      fullName: faculty.fullName,
      facultyId: faculty.facultyId
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};