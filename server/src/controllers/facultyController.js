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

// Update marks by exam type (internal, external, assignment)
export const updateMarks = async (req, res) => {
  try {
    const { subjectId, semester, examType, marksData } = req.body;
    // examType: 'internal' | 'external' | 'assignment'
    // marksData = { studentId: marks } e.g., { "123": 25, "456": 20 }

    // Max marks validation
    const maxMarks = {
      internal: 30,
      external: 70,
      assignment: 30
    };

    const max = maxMarks[examType];
    if (!max) {
      return res.status(400).json({ message: "Invalid exam type" });
    }

    for (const [studentId, markValue] of Object.entries(marksData)) {
      const marks = parseFloat(markValue) || 0;

      // Validate marks
      if (marks < 0 || marks > max) {
        return res.status(400).json({
          message: `${examType} marks must be between 0 and ${max}`
        });
      }

      // Update marks - assignment field name is different
      let fieldName;
      if (examType === "assignment") {
        fieldName = "assignment";
      } else {
        fieldName = examType + "Marks";
      }

      const updateData = { [fieldName]: marks };

      const studentSubject = await StudentSubject.findOneAndUpdate(
        {
          student: studentId,
          subject: subjectId,
          semester: semester
        },
        updateData,
        { new: true }
      );

      // Calculate total marks
      if (studentSubject) {
        const totalMarks =
          (studentSubject.internalMarks || 0) +
          (studentSubject.externalMarks || 0) +
          (studentSubject.assignment || 0);

        await StudentSubject.findByIdAndUpdate(
          studentSubject._id,
          { totalMarks },
          { new: true }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: `${examType} marks updated successfully`
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

// Get student marks data for a specific subject
export const getSubjectMarksData = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { semester } = req.query;

    const marksData = await StudentSubject.find({
      subject: subjectId,
      semester: parseInt(semester)
    }).populate('student', 'fullName enrollmentId');

    // Calculate statistics
    const studentMarks = marksData.map(record => ({
      studentName: record.student?.fullName || 'Unknown',
      enrollmentId: record.student?.enrollmentId || 'N/A',
      internalMarks: record.internalMarks || 0,
      externalMarks: record.externalMarks || 0,
      assignment: record.assignment || 0,
      totalMarks: record.totalMarks || 0,
      averageMarks: ((record.internalMarks || 0) + (record.externalMarks || 0) + (record.assignment || 0)) / 3,
      attendance: record.attendance || 0
    }));

    // Calculate class statistics
    const totalStudents = studentMarks.length;
    const avgInternal = studentMarks.reduce((sum, s) => sum + s.internalMarks, 0) / totalStudents || 0;
    const avgExternal = studentMarks.reduce((sum, s) => sum + s.externalMarks, 0) / totalStudents || 0;
    const avgAssignment = studentMarks.reduce((sum, s) => sum + s.assignment, 0) / totalStudents || 0;
    const avgTotal = studentMarks.reduce((sum, s) => sum + s.totalMarks, 0) / totalStudents || 0;
    const avgAttendance = studentMarks.reduce((sum, s) => sum + s.attendance, 0) / totalStudents || 0;

    res.status(200).json({
      success: true,
      studentMarks,
      classStats: {
        totalStudents,
        avgInternal: avgInternal.toFixed(2),
        avgExternal: avgExternal.toFixed(2),
        avgAssignment: avgAssignment.toFixed(2),
        avgTotal: avgTotal.toFixed(2),
        avgAttendance: avgAttendance.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

