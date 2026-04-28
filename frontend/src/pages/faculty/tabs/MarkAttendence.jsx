import { useState, useEffect } from 'react'
import { useSubject } from '../../../context/subjectContext'
import { useAuth } from '../../../context/authContext'
import { getStudentsBySemester, markAttendance } from '../../../services/facultyApi'

const MarkAttendence = () => {
  const { selectedSubject } = useSubject()
  const { user } = useAuth()
  
  // Get today's date in local timezone (YYYY-MM-DD format)
  const getLocalDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = getLocalDate()

  const [selectedDate, setSelectedDate] = useState(today)
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({}) // { studentId: true/false }
  const [loading, setLoading] = useState(false)
  const [selectAll,setSelectAll] = useState(false)

  console.log(selectedDate);
  

  // Fetch students on component mount or semester change
 useEffect(() => {
  if (user?.semester && selectedSubject) {
    fetchStudents()
  }
}, [user?.semester, selectedSubject])

  useEffect(() => {
  if (!selectedSubject) {
    setStudents([]);
    setAttendance({});
  }
}, [selectedSubject]);

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await getStudentsBySemester(user.semester)
      setStudents(data.students)
      
      // Initialize attendance object
      const initialAttendance = {}
      data.students.forEach(student => {
        initialAttendance[student._id] = false
      })
      setAttendance(initialAttendance)
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

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
    }))
  }

  const handleSaveAttendance = async () => {
    try {
      if (!selectedSubject?._id) {
        alert("Please select a subject")
        return
      }

       const hasAnySelected = Object.values(attendance).some(val => val === true);

    if (!hasAnySelected) {
      alert("Please select at least one student");
      return;
    }

      await markAttendance(selectedSubject._id, user.semester, attendance)
      alert("Attendance marked successfully for " + selectedDate)
      
      // Reset
      const initialAttendance = {}
      students.forEach(student => {
        initialAttendance[student._id] = false
      })
      setAttendance(initialAttendance)
    } catch (error) {
      console.error("Error marking attendance:", error)
      alert("Failed to mark attendance")
    }
  }

  return (
    <div className="bg-gray-50 p-6 w-full">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold">Mark Student Attendance</h2>
        <p>
          <h2 className="text-base font-semibold">
            Semester {selectedSubject?.semester}
          </h2>

          <h3 className="text-sm text-gray-500">
            Subject: {selectedSubject?.subjectName}
          </h3>
        </p>

        {/* SIDE BY SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* SUBJECT */}
          <div>
            <h2 className='text-base font-semibold'>Subject</h2>
            <div className="mt-2 p-2 rounded-lg bg-gray-100">
              {selectedSubject?.subjectName || "No subject selected"}
            </div>
          </div>

          {/* DATE */}
          <div>
            <h2 className='text-base font-semibold'>Select the date</h2>
            <input
              type='date'
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-2 w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>
        </div>

        {/* STUDENTS LIST */}
        {!selectedSubject ? (
  <p className="text-gray-500 mt-6">
    Please select a subject to mark attendance
  </p>
) : (
  <div>
        <div>
          <h2 className='text-base mt-10 font-semibold'>Students ({students.length}) 
          <input
            type="checkbox"
            id='select all'
            checked={selectAll}
            onChange={handleSelectAll}
            className="ml-5.5"
          /> 
          <label htmlFor='select all' className='ml-1.5'>Select all</label></h2>
          
          {loading ? (
            <p className="text-gray-500">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-gray-500">No students in this semester</p>
          ) : (
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
              {students.map((student) => (
                <label key={student._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={attendance[student._id] || false}
                    onChange={() => handleAttendanceToggle(student._id)}
                    className="w-4 h-4"
                  />
                  <span className="flex-1">
                    {student.fullName} ({student.enrollmentId})
                  </span>
                </label>
              ))}
            </div>
          )}
        
        </div>
        </div> 
)}
        
        {/* SAVE BUTTON */}
        <button
          onClick={handleSaveAttendance}
          disabled={
  !selectedSubject?._id ||
  students.length === 0 ||
  !Object.values(attendance).some(val => val === true)
}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Save Attendance
        </button>
      </div>
    </div>
  )
}

export default MarkAttendence