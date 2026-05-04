import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/authContext'
import { useSubject } from '../../../context/subjectContext'
import { getStudentsBySemester, updateMarks } from '../../../services/facultyApi'

const UploadMarks = () => {
  const { user } = useAuth()
  const {selectedSubject} = useSubject();

  
  const [examType, setExamType] = useState('internal')
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState({})
  const [loading, setLoading] = useState(false)

  const examTypes = [
    { value: 'internal', label: 'Internal Marks (Max: 30)', max: 30 },
    { value: 'external', label: 'External Marks (Max: 70)', max: 70 },
    { value: 'Practical', label: 'Practical Marks (Max: 30)', max: 30 }
  ]

  // Initialize subjects from user profile
  // Fetch students when subject changes
  useEffect(() => {
    if (selectedSubject?.semester && selectedSubject?._id) {
      fetchStudents()
    }
  }, [selectedSubject?.semester, selectedSubject?._id])

  useEffect(() => {
  if (students.length === 0) return;

  const resetMarks = {};
  students.forEach((student) => {
    resetMarks[student._id] = "";
  });

  setMarks(resetMarks);
}, [examType]);

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await getStudentsBySemester(selectedSubject.semester)
      setStudents(data.students)
      
      // Initialize marks
      const initialMarks = {}
      data.students.forEach(student => {
        initialMarks[student._id] = ''
      })
      setMarks(initialMarks)
    } catch (error) {
      console.error('Error fetching students:', error)
      alert('Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      if (!selectedSubject?._id) {
        alert('Please select a subject')
        return
      }

      // Validate marks before submission
      const maxMark = examTypes.find(e => e.value === examType)?.max || 30
      const marksToSubmit = {}
      let hasMarks = false
      
      for (const [studentId, markValue] of Object.entries(marks)) {
        // Skip empty fields
        if (markValue === '') {
          continue
        }
        
        hasMarks = true
        const mark = parseFloat(markValue)
        if (isNaN(mark) || mark < 0 || mark > maxMark) {
          alert(`${examType} marks must be between 0 and ${maxMark}`)
          return
        }
        
        marksToSubmit[studentId] = mark
      }

      // Check if at least one mark was entered
      if (!hasMarks) {
        alert('Please enter marks for at least one student')
        return
      }

      await updateMarks(selectedSubject._id, selectedSubject.semester, examType, marksToSubmit)
      alert('Marks submitted successfully!')
      
      // Reset marks
      const initialMarks = {}
      students.forEach(student => {
        initialMarks[student._id] = ''
      })
      setMarks(initialMarks)
      
    } catch (error) {
      console.error('Error submitting marks:', error)
      alert('Failed to submit marks')
    }
  }
  const hasMarksEntered = Object.values(marks).some(val => val !== "");

  return (
    <div className="bg-gray-50 p-6 w-full">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Upload Marks</h2>

        {/* Subject and Exam Type Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Subject Dropdown */}
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Subject
  </label>

  <div className="w-full p-3 rounded-lg bg-gray-100">
    {selectedSubject?.subjectName || "No subject selected"}
  </div>
</div>

          {/* Exam Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Exam Type
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {examTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students List with Marks Input */}
        {selectedSubject && (
          <>
            {loading ? (
              <p className="text-gray-500">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="text-gray-500">No students in this semester</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse table-fixed">
                    <thead>
                      <tr className="bg-gray-100 border">
                        <th className="p-3 text-left">Student Name</th>
                        <th className="p-3 text-left">Enrollment ID</th>
                        <th className="p-3 text-center">
                          {examTypes.find(e => e.value === examType)?.label}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student._id} className="border hover:bg-gray-50">
                          <td className="p-3">{student.fullName}</td>
                          <td className="p-3">{student.enrollmentId}</td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max={examTypes.find(e => e.value === examType)?.max}
                              value={marks[student._id] || ''}
                              onChange={(e) => handleMarkChange(student._id, e.target.value)}
                              className="w-24 p-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!selectedSubject?._id || !hasMarksEntered}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400"
                >
                  Submit Marks
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UploadMarks