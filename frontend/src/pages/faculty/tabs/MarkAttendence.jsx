import { useState, useEffect, useCallback } from 'react';
import { useSubject } from '../../../context/subjectContext';
import { useToast } from '../../../context/toastContext';
import { getStudentsBySemester, markAttendance, getAttendanceStatus } from '../../../services/facultyApi';
import { Calendar, BookOpen, Users, Save, Lock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { SkeletonChecklist } from '../../../components/ui/Skeleton';

const MarkAttendence = () => {
  const { selectedSubject } = useSubject();
  const toast = useToast();
  
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
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState("");

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
      setIsLocked(false);
      setLockMessage("");
    }
  }, [selectedSubject]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudentsBySemester(selectedSubject.semester);
      const studentList = data.students || [];
      setStudents(studentList);
      
      // Initialize blank attendance
      const initialAttendance = {};
      studentList.forEach(student => {
        initialAttendance[student._id] = false;
      });
      setAttendance(initialAttendance);

      // Check attendance status for the currently selected date
      if (selectedSubject?._id) {
        await checkDateStatus(selectedSubject._id, selectedSubject.semester, selectedDate, studentList);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students roster.");
    } finally {
      setLoading(false);
    }
  };

  // Check if attendance is already locked for the selected date
  const checkDateStatus = useCallback(async (subjectId, semester, date, studentList = students) => {
    if (!subjectId || !semester || !date) return;

    try {
      setCheckingStatus(true);
      const statusRes = await getAttendanceStatus(subjectId, semester, date);

      if (statusRes.isMarked) {
        setIsLocked(true);
        setLockMessage(`Attendance for ${date} has already been marked and is locked until the next date.`);
        
        // Populate recorded attendance if available
        if (statusRes.records && Object.keys(statusRes.records).length > 0) {
          const loadedAttendance = {};
          studentList.forEach(s => {
            loadedAttendance[s._id] = Boolean(statusRes.records[s._id]);
          });
          setAttendance(loadedAttendance);
          const allMarkedPresent = studentList.length > 0 && studentList.every(s => loadedAttendance[s._id]);
          setSelectAll(allMarkedPresent);
        }
      } else {
        setIsLocked(false);
        setLockMessage("");
        
        // Reset to all false for unmarked date
        const freshAttendance = {};
        studentList.forEach(student => {
          freshAttendance[student._id] = false;
        });
        setAttendance(freshAttendance);
        setSelectAll(false);
      }
    } catch (error) {
      console.error("Error checking date status:", error);
    } finally {
      setCheckingStatus(false);
    }
  }, [students]);

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (selectedSubject?._id && selectedSubject?.semester) {
      checkDateStatus(selectedSubject._id, selectedSubject.semester, newDate, students);
    }
  };

  const handleSelectAll = () => {
    if (isLocked) {
      toast.warning("Attendance is locked for this date and cannot be modified.");
      return;
    }
    const newValue = !selectAll;
    setSelectAll(newValue);

    const updated = {};
    students.forEach((student) => {
      updated[student._id] = newValue;
    });

    setAttendance(updated);
  };

  const handleAttendanceToggle = (studentId) => {
    if (isLocked) {
      toast.warning("Attendance is locked for this date and cannot be modified.");
      return;
    }
    setAttendance(prev => {
      const nextState = {
        ...prev,
        [studentId]: !prev[studentId]
      };
      const allSelected = students.length > 0 && students.every(s => nextState[s._id]);
      setSelectAll(allSelected);
      return nextState;
    });
  };

  const handleSaveAttendance = async () => {
    if (isLocked) {
      toast.warning(`Attendance for ${selectedDate} has already been recorded and is locked until the next date.`);
      return;
    }

    try {
      if (!selectedSubject?._id) {
        toast.warning("Please select an active subject first.");
        return;
      }

      const hasAnySelected = Object.values(attendance).some(val => val === true);

      if (!hasAnySelected) {
        toast.warning("Please mark at least one student present before saving.");
        return;
      }

      setSubmitting(true);
      await markAttendance(selectedSubject._id, selectedSubject.semester, attendance, selectedDate);
      
      const presentCount = Object.values(attendance).filter(Boolean).length;
      toast.success(`Attendance successfully recorded for ${selectedDate} (${presentCount} present)!`);
      
      // Lock the date immediately after successful submission
      setIsLocked(true);
      setLockMessage(`Attendance for ${selectedDate} has been recorded and locked until the next date.`);
    } catch (error) {
      console.error("Error marking attendance:", error);
      const errorMsg = error.response?.data?.message || "Failed to mark attendance.";
      toast.error(errorMsg);
      if (error.response?.status === 400 && errorMsg.includes("already been marked")) {
        setIsLocked(true);
        setLockMessage(errorMsg);
      }
    } finally {
      setSubmitting(false);
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
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" />
              <span>Attendance Date</span>
            </label>
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                <Lock size={11} /> Locked
              </span>
            )}
          </div>
          <input
            type="date"
            value={selectedDate}
            max={today}
            onChange={(e) => handleDateChange(e.target.value)}
            disabled={checkingStatus || submitting}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-900 focus:border-blue-600 outline-none cursor-pointer disabled:opacity-60"
          />
        </div>
      </div>

      {/* Locked Status Alert Banner */}
      {isLocked && selectedSubject && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed space-y-0.5">
            <p className="font-bold text-amber-950">Attendance Locked for {selectedDate}</p>
            <p className="text-amber-800">
              {lockMessage || `Attendance for ${selectedDate} has already been marked and finalized. You cannot unchange or edit it until the next date.`}
            </p>
          </div>
        </div>
      )}

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

            {students.length > 0 && !loading && !checkingStatus && (
              <label 
                className={`inline-flex items-center gap-2 text-xs font-semibold ${
                  isLocked 
                    ? "text-slate-400 cursor-not-allowed" 
                    : "text-slate-700 hover:text-blue-600 cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectAll}
                  disabled={isLocked || submitting}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span>Select All Present</span>
              </label>
            )}
          </div>

          {loading || checkingStatus ? (
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
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                    } ${
                      isChecked
                        ? "bg-blue-50/70 border-blue-200 text-blue-950 font-medium"
                        : "bg-white border-slate-100 hover:border-slate-200 text-slate-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isLocked || submitting}
                      onChange={() => handleAttendanceToggle(student._id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex-1 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{student.fullName}</span>
                        {isLocked && isChecked && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            <CheckCircle2 size={10} /> Present
                          </span>
                        )}
                        {isLocked && !isChecked && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            Absent
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        ID: {student.enrollmentId}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {/* Submit / Locked Action Button */}
          <div className="pt-2">
            {isLocked ? (
              <button
                type="button"
                disabled={true}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 text-slate-500 text-xs font-semibold rounded-xl cursor-not-allowed border border-slate-300"
              >
                <Lock size={16} className="text-slate-500" />
                <span>Attendance Locked for {selectedDate}</span>
              </button>
            ) : (
              <button
                onClick={handleSaveAttendance}
                disabled={
                  !selectedSubject?._id ||
                  students.length === 0 ||
                  submitting ||
                  checkingStatus ||
                  !Object.values(attendance).some(val => val === true)
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Attendance...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Attendance Record</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendence;
