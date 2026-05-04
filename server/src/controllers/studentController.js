import StudentSubject from "../models/StudentSubject.js";
import Student from "../models/Student.js";
import { getRiskLevel, countByRiskLevel } from "../utils/riskAnalysis.js";

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
    const { subjectId, semester } = req.query;

    console.log("🔍 getRiskStudents called - subjectId:", subjectId, "semester:", semester);

    // ❌ DO NOT use records before declaration (you had this bug)
    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID required",
      });
    }

    // 🔥 Build query
    let query = { subject: subjectId };

    if (semester && !isNaN(semester)) {
      query.semester = parseInt(semester);
    }

    // 🔥 Fetch records
    const records = await StudentSubject.find(query)
      .populate("student", "fullName enrollmentId semester");

    console.log("📊 Found StudentSubject records:", records.length);

    if (records.length > 0) {
      console.log("🔎 First record:", records[0]);
      console.log("👤 First student:", records[0].student);
    }

    // 🔥 If no data
    if (records.length === 0) {
      return res.json({
        success: true,
        students: [],
        summary: {
          High: 0,
          Medium: 0,
          Low: 0,
          total: 0
        }
      });
    }

    // 🔥 Map students safely
    const students = records
      .map((r, index) => {
        if (!r.student) {
          console.warn(`⚠️ Missing student at index ${index}`);
          return null;
        }

        const internal = r.internalMarks || 0;
        const external = r.externalMarks || 0;
        const practical = r.Practical || 0;

        const totalMarks = internal + external + practical;
        const attendance = Math.round(r.attendance || 0);

        const riskLevel = getRiskLevel(attendance, totalMarks);

        return {
          _id: r._id,
          studentId: r.student._id,
          name: r.student.fullName,
          enrollmentId: r.student.enrollmentId || "N/A",
          attendance,
          internalMarks: internal,
          externalMarks: external,
          Practical: practical,
          totalMarks,
          riskLevel,
        };
      })
      .filter(Boolean);

    // 🔥 SORT (IMPORTANT FIX: correct labels)
    const sortedStudents = students.sort((a, b) => {
      const order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
      };
      return order[a.riskLevel] - order[b.riskLevel];
    });

    // 🔥 SUMMARY
    const summary = {
      High: sortedStudents.filter(s => s.riskLevel === "High").length,
      Medium: sortedStudents.filter(s => s.riskLevel === "Medium").length,
      Low: sortedStudents.filter(s => s.riskLevel === "Low").length,
      total: sortedStudents.length
    };

    console.log(
      "✅ Risk students processed - High:",
      summary.High,
      "Medium:",
      summary.Medium,
      "Low:",
      summary.Low
    );

    // 🔥 RESPONSE
    return res.json({
      success: true,
      students: sortedStudents,
      summary
    });

  } catch (error) {
    console.error("❌ Error in getRiskStudents:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};