import React from 'react'
import { useAuth } from '../../../context/authContext'

const Profile = ({ subjects }) => {
  const { user } = useAuth();

  if (!subjects || subjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">No profile data available</p>
      </div>
    );
  }

  // Calculate statistics
  const totalSubjects = subjects.length;
  const totalAttendance = subjects.reduce((sum, s) => sum + (s.attendance || 0), 0);
  const avgAttendance = (totalAttendance / totalSubjects).toFixed(2);
  
  const totalMarks = subjects.reduce((sum, s) => sum + ((s.internalMarks || 0) + (s.externalMarks || 0)), 0);
  const avgMarks = (totalMarks / totalSubjects).toFixed(2);

  const riskSubjects = subjects.filter(s => s.status === "Risk").length;
  const safeSubjects = subjects.filter(s => s.status === "Safe").length;
  const warningSubjects = subjects.filter(s => s.status === "Warning").length;

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?.fullName || 'Student'}</h2>
            <p className="text-gray-600">Enrollment ID: {user?.enrollmentId || 'N/A'}</p>
            <p className="text-gray-600">Semester: {user?.semester || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Academic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Subjects</span>
              <span className="text-xl font-bold text-blue-600">{totalSubjects}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Average Attendance</span>
              <span className="text-xl font-bold text-green-600">{avgAttendance}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Marks</span>
              <span className="text-xl font-bold text-purple-600">{avgMarks}/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Safe Subjects</span>
              </div>
              <span className="text-xl font-bold text-green-600">{safeSubjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600">Warning Subjects</span>
              </div>
              <span className="text-xl font-bold text-yellow-600">{warningSubjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Risk Subjects</span>
              </div>
              <span className="text-xl font-bold text-red-600">{riskSubjects}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Enrolled Subjects</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject Name</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Attendance</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Marks</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => {
                const statusColor = subject.status === "Safe" ? "bg-green-100 text-green-700" :
                                   subject.status === "Warning" ? "bg-yellow-100 text-yellow-700" :
                                   "bg-red-100 text-red-700";
                
                return (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">{subject.subject?.subjectCode || subject.subjectCode || "N/A"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{subject.subject?.subjectName || subject.subjectName || "Unknown"}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">{subject.attendance || 0}%</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-purple-600">{(subject.internalMarks || 0) + (subject.externalMarks || 0)}/100</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                        {subject.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Profile