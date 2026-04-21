import React from 'react'

const Cards = ({ subjects = [] }) => {
  
  // Calculate real-time data
  const calculateStats = () => {
    if (!subjects || subjects.length === 0) {
      return {
        avgAttendance: 0,
        avgMarks: 0,
        grade: 'N/A',
        riskLevel: 'LOW',
        riskCount: 0
      };
    }

    // Calculate average attendance
    const totalAttendance = subjects.reduce((sum, s) => sum + (s.attendance || 0), 0);
    const avgAttendance = parseFloat((totalAttendance / subjects.length).toFixed(1));

    // Calculate average marks
    const totalMarks = subjects.reduce((sum, s) => sum + ((s.internalMarks || 0) + (s.externalMarks || 0)), 0);
    const avgMarks = parseFloat((totalMarks / subjects.length).toFixed(1));

    // Determine grade based on marks
    let grade = 'D';
    if (avgMarks >= 90) grade = 'A+';
    else if (avgMarks >= 80) grade = 'A';
    else if (avgMarks >= 70) grade = 'B';
    else if (avgMarks >= 60) grade = 'C';

    // Count risk subjects
    const riskCount = subjects.filter(s => s.status === 'Risk').length;

    // Determine risk level
    let riskLevel = 'LOW';
    if (avgAttendance < 75 || riskCount > 1) riskLevel = 'HIGH';
    else if (avgAttendance < 85 || riskCount === 1) riskLevel = 'MEDIUM';

    return { avgAttendance, avgMarks, grade, riskLevel, riskCount };
  };

  const stats = calculateStats();

  const getRiskColor = () => {
    switch (stats.riskLevel) {
      case 'HIGH':
        return 'bg-red-100 text-red-700';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  const getRiskIcon = () => {
    switch (stats.riskLevel) {
      case 'HIGH':
        return '🔴';
      case 'MEDIUM':
        return '🟡';
      default:
        return '🟢';
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 mt-6">
        
        {/* Attendance Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-700 text-sm font-semibold">Attendance</h3>
            <span className="text-blue-500 text-2xl">📅</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            {stats.avgAttendance}%
          </h2>

          <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all" 
              style={{ width: `${stats.avgAttendance}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-gray-600">Based on {subjects.length} subjects</p>
        </div>

        {/* Average Marks Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-700 text-sm font-semibold">Average Marks</h3>
            <span className="text-green-500 text-2xl">🎖</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            {stats.avgMarks}/100
          </h2>

          <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all" 
              style={{ width: `${stats.avgMarks}%` }}
            ></div>
          </div>

          <p className="text-xs text-gray-600">Out of {subjects.length} subjects</p>
        </div>

        {/* Predicted Grade Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-700 text-sm font-semibold">Predicted Grade</h3>
            <span className="text-purple-500 text-2xl">📈</span>
          </div>

          <div className="flex items-center justify-center">
            <h2 className="text-5xl font-bold text-purple-700">
              {stats.grade}
            </h2>
          </div>

          <p className="text-xs text-gray-600 text-center">
            {stats.avgMarks >= 90 ? 'Excellent' : 
             stats.avgMarks >= 80 ? 'Very Good' :
             stats.avgMarks >= 70 ? 'Good' :
             stats.avgMarks >= 60 ? 'Satisfactory' : 'Needs Improvement'}
          </p>
        </div>

        {/* Risk Level Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-700 text-sm font-semibold">Risk Level</h3>
            <span className="text-2xl">{getRiskIcon()}</span>
          </div>

          <span className={`${getRiskColor()} text-sm font-bold px-4 py-2 rounded-full w-fit text-center`}>
            {stats.riskLevel}
          </span>

          <p className="text-xs text-gray-600">
            {stats.riskCount > 0 ? `${stats.riskCount} subject(s) at risk` : 'All subjects safe'}
          </p>
        </div>

      </div>
    </div>
  )
}

export default Cards