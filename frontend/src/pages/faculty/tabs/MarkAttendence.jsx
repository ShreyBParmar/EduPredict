import { useState, useEffect } from 'react';
import { useSubject } from '../../../context/subjectContext';
import { getStudentsBySemester, markAttendance } from '../../../services/facultyApi';
import { Calendar, BookOpen, Users, Save } from 'lucide-react';
import { SkeletonChecklist } from '../../../components/ui/Skeleton';

const MarkAttendence = () => {
  const { selectedSubject } = useSubject();
  
  // Get today's date in local timezone (YYYY-MM-DD format)
  const getLocalDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = getLocalDate();

  const [selectedDate, setSelectedDate] = useState(today);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: true/false }
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch students when subject changes
  useEffect(() => {
    if (selectedSubject?.semester && selectedSubject?._id) {
      fetchStudents();
    }
  }, [selectedSubject?.semester, selectedSubject?._id]);

  useEffect(() => {
    if (!selectedSubject) {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedSubject]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudentsBySemester(selectedSubject.semester);
      setStudents(data.students);
      
      // Initialize attendance object
      const initialAttendance = {};
      data.students.forEach(student => {
        initialAttendance[student._id] = false;
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);

    const updated = {};
    students.forEach((student) => {
      updated[student._id] = newValue;
    });

    setAttendance(updated);
  };

  const handleAttendanceToggle = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      if (!selectedSubject?._id) {
        alert("Please select a subject");
        return;
      }

      const hasAnySelected = Object.values(attendance).some(val => val === true);

      if (!hasAnySelected) {
        alert("Please select at least one student");
        return;
      }

      await markAttendance(selectedSubject._id, selectedSubject.semester, attendance);
      alert("Attendance marked successfully for " + selectedDate);
      
      // Reset
      const initialAttendance = {};
      students.forEach(student => {
        initialAttendance[student._id] = false;
      });
      setAttendance(initialAttendance);
      setSelectAll(false);
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Mark Student Attendance</h2>
        {selectedSubject && (
          <p className="text-xs text-slate-500 mt-1">
            Semester <span className="font-semibold text-slate-700">{selectedSubject.semester}</span> • Subject: <span className="font-semibold text-slate-700">{selectedSubject.subjectName}</span>
          </p>
        )}
      </div>

      {/* Control Toolbar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject Display Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
          <label className="block text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <BookOpen size={14} className="text-slate-400" />
            <span>Active Subject</span>
          </label>
          <p className="text-sm font-semibold text-slate-900">
            {selectedSubject?.subjectName || "No subject selected"}
          </p>
        </div>

        {/* Date Selector */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
          <label className="block text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-400" />
            <span>Attendance Date</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-900 focus:border-blue-600 outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Students Checklist Container */}
      {!selectedSubject ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">Please select a subject above to mark attendance</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Student Roster ({students.length})
              </h3>
            </div>

            {students.length > 0 && !loading && (
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 hover:text-blue-600">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span>Select All Present</span>
              </label>
            )}
          </div>

          {loading ? (
            <SkeletonChecklist count={5} />
          ) : students.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No students found in this semester</p>
          ) : (
            <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-xl p-3 space-y-1.5 bg-slate-50/50">
              {students.map((student) => {
                const isChecked = attendance[student._id] || false;
                return (
                  <label
                    key={student._id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? "bg-blue-50/70 border-blue-200 text-blue-950 font-medium"
                        : "bg-white border-slate-100 hover:border-slate-200 text-slate-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAttendanceToggle(student._id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{student.fullName}</span>
                      <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">ID: {student.enrollmentId}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              onClick={handleSaveAttendance}
              disabled={
                !selectedSubject?._id ||
                students.length === 0 ||
                !Object.values(attendance).some(val => val === true)
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
            >
              <Save size={16} />
              <span>Save Attendance Record</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendence;