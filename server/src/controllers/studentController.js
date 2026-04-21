import StudentSubject from "../models/StudentSubject.js";
import Student from "../models/Student.js";

export const getStudentDashboard = async (req, res) => {
  try {

    const studentId = req.user.refId;

    const student = await Student.findById(studentId);

    const subjects = await StudentSubject.find({ student: studentId })
      .populate("subject", "subjectName").select("subject");

    const formattedSubjects = subjects.map(s => s.subject);

    res.json({
      success: true,
      studentName: student.fullName,
      semester: student.semester,
      subjects: formattedSubjects
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};