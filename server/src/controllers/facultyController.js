import Faculty from "../models/Faculty.js";
import StudentSubject from "../models/StudentSubject.js";
import Student from "../models/Student.js";

// GET subjects for faculty + semester
export const getFacultySubjects= async (req, res) => {
  try {
    const { facultyId, semester } = req.query;

    const data = await FacultySubject.find({
      faculty: facultyId,
      semester
    }).populate("subject","subjectName");

    const subjects = data.map(item => item.subject);

    res.json(subjects);

  } catch (err) {
    res.status(500).json({ message: "Error fetching subjects" });
  }
};

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

    console.log(`📋 markAttendance called - subjectId: ${subjectId}, semester: ${semester}`);
    console.log(`   Students to mark: ${Object.keys(attendanceData).length}`);

    for (const [studentId, isPresent] of Object.entries(attendanceData)) {

      let record = await StudentSubject.findOne({
        student: studentId,
        subject: subjectId,
        semester: semester
      });

      // If not exist, create new
      if (!record) {
        console.log(`   Creating new record for student ${studentId}`);
        record = new StudentSubject({
          student: studentId,
          subject: subjectId,
          semester: semester,
          classesHeld: 0,
          classesAttended: 0
        });
      }

      // 🔥 Increment total classes
      record.classesHeld += 1;

      // 🔥 Increment attended if present
      if (isPresent) {
        record.classesAttended += 1;
      }

      // 🔥 Calculate percentage
      record.attendance =
        (record.classesAttended / record.classesHeld) * 100;

      await record.save();
      console.log(`   ✅ Updated student ${studentId}: Attendance = ${record.attendance}%`);
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated correctly"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update marks by exam type (internal, external, Practical)
export const updateMarks = async (req, res) => {
  try {
    const { subjectId, semester, examType, marksData } = req.body;
    
    console.log(`📝 updateMarks called - examType: ${examType}, subjectId: ${subjectId}, semester: ${semester}`);
    console.log(`   Students to update: ${Object.keys(marksData).length}`);
    
    // examType: 'internal' | 'external' | 'Practical'
    // marksData = { studentId: marks } e.g., { "123": 25, "456": 20 }

    // Max marks validation
    const maxMarks = {
      internal: 30,
      external: 70,
      Practical: 30
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

      // Update marks - Practical field name is different
      let fieldName;
      if (examType === "Practical") {
        fieldName = "Practical";
      } else {
        fieldName = examType + "Marks";
      }

      const updateData = { [fieldName]: marks };

      // Use upsert to create record if it doesn't exist
      const studentSubject = await StudentSubject.findOneAndUpdate(
        {
          student: studentId,
          subject: subjectId,
          semester: semester
        },
        updateData,
        { new: true, upsert: true }  // ✅ upsert: true creates record if not found
      );

      console.log(`   ✅ Updated student ${studentId}: ${fieldName} = ${marks}`);

      // Calculate total marks
      if (studentSubject) {
        const totalMarks =
          (studentSubject.internalMarks || 0) +
          (studentSubject.externalMarks || 0) +
          (studentSubject.Practical || 0);

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
      Practical: record.Practical || 0,
      totalMarks: record.totalMarks || 0,
      // Average normalized to 0-100 scale: (sum of marks / total possible) * 100
      averageMarks: (((record.internalMarks || 0) + (record.externalMarks || 0) + (record.Practical || 0)) / 130) * 100,
      attendance: record.attendance || 0
    }));

    // Calculate class statistics
    const totalStudents = studentMarks.length;
    const avgInternal = studentMarks.reduce((sum, s) => sum + s.internalMarks, 0) / totalStudents || 0;
    const avgExternal = studentMarks.reduce((sum, s) => sum + s.externalMarks, 0) / totalStudents || 0;
    const avgPractical = studentMarks.reduce((sum, s) => sum + s.Practical, 0) / totalStudents || 0;
    const avgTotal = studentMarks.reduce((sum, s) => sum + s.totalMarks, 0) / totalStudents || 0;
    const avgAttendance = studentMarks.reduce((sum, s) => sum + s.attendance, 0) / totalStudents || 0;

    res.status(200).json({
      success: true,
      studentMarks,
      classStats: {
        totalStudents,
        avgInternal: avgInternal.toFixed(2),
        avgExternal: avgExternal.toFixed(2),
        avgPractical: avgPractical.toFixed(2),
        avgTotal: avgTotal.toFixed(2),
        avgAttendance: avgAttendance.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

