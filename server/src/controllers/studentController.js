import StudentSubject from "../models/StudentSubject.js";
import Student from "../models/Student.js";

export const getStudentDashboard = async (req, res) => {
  try {
    console.log("🔍 Fetching dashboard for user:", req.user.id);
    console.log("📌 Student refId:", req.user.refId);
    
    const student = await Student.findById(req.user.refId);
    
    if (!student) {
      console.log("❌ Student not found with refId:", req.user.refId);
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    console.log("✅ Student found:", student.fullName);

    // Fetch all StudentSubject records for this student, with populated subject details
    const subjects = await StudentSubject.find({ student: req.user.refId })
      .populate("subject", "subjectName subjectCode");

    console.log("📚 Found subjects:", subjects.length);

    // Format subjects with all necessary data for dashboard
    const formattedSubjects = subjects.map(s => ({
      subject: {
        subjectName: s.subject?.subjectName,
        subjectCode: s.subject?.subjectCode
      },
      classesHeld: s.classesHeld || 0,
      classesAttended: s.classesAttended || 0,
      attendance: s.attendance || 0,
      internalMarks: s.internalMarks || 0,
      externalMarks: s.externalMarks || 0,
      Practical: s.Practical || 0,
      totalMarks: s.totalMarks || 0,
      grade: s.grade || "N/A",
      status: s.status || "Safe"
    }));

    res.json({
      success: true,
      studentName: student.fullName,
      semester: student.semester,
      subjects: formattedSubjects
    });

  } catch (error) {
    console.error("❌ Dashboard error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRiskStudents = async (req, res) => {
  try {
    const { subjectId } = req.query;

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID required",
      });
    }

    const records = await StudentSubject.find({ subject: subjectId })
      .populate("student", "fullName enrollmentId");

    const students = records.map((r) => {
      const internal = r.internalMarks || 0;
      const external = r.externalMarks || 0;
      const Practical = r.Practical || 0;

      const totalMarks = internal + external + Practical;

      let riskLevel = "Low";

      if (totalMarks < 40) {
        riskLevel = "High";
      } else if (totalMarks <= 70) {
        riskLevel = "Medium";
      } else if(totalMarks >70){
        riskLevel = "Low";
      }

      return {
        student: r.student,
        attendance: r.attendance || 0,
        totalMarks,
        riskLevel,
      };
    });

    res.json({
      success: true,
      students,
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};