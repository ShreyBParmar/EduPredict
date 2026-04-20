import Faculty from "../models/Faculty.js";
import StudentSubject from "../models/StudentSubject.js";
import Student from "../models/Student.js";
// Get all students in the faculty's semester
export const getStudentsBySemester = async (req, res) => {
  try {
    const { semester } = req.params;

    const students = await Student.find({ semester: parseInt(semester) });

    res.status(200).json({
      success: true,
      students: students
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark attendance for students in a subject
export const markAttendance = async (req, res) => {
  try {
    const { subjectId, semester, attendanceData } = req.body;
    // attendanceData = { studentId: attendanceValue } e.g., { "123": true, "456": false }

    for (const [studentId, isPresent] of Object.entries(attendanceData)) {
      await StudentSubject.findOneAndUpdate(
        { 
          student: studentId, 
          subject: subjectId, 
          semester: semester 
        },
        { 
          attendance: isPresent ? 1 : 0 
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

