import {useState} from 'react'
import { useSubject } from '../../../context/subjectContext'

const MarkAttendence = () => {
  const {selectedSubject}=useSubject()
  const today = new Date().toISOString().split("T")[0];

const [selectedDate, setSelectedDate] = useState(today);

  return (
   <div className=" bg-gray-50 p-6 w-screen">
  <div className="bg-white p-6 rounded-2xl shadow-sm">

    <h2 className="text-lg font-semibold">Mark Student Attendance</h2>
    <p className="text-gray-500 text-sm mb-4">
      Select a student
    </p>

    {/* SIDE BY SIDE */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
    <div>
       <h2 className='text-base mt-10 border font-semibold'>Students</h2>
        <input />
    </div>
  </div>
</div>
  )
}

export default MarkAttendence