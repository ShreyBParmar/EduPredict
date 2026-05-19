import React from 'react'

const Cards = ({ subjects = [] }) => {
  
  // Calculate real-time data
  const calculateStats = () => {
    if (!subjects || subjects.length === 0) {
      return {
        avgAttendance: 0,
        avgMarks: 0,
        grade: 'N/A',
        riskLevel: 'Low',
        riskScore: 0,
        predictedGrade: 'N/A',
        subjectsStrong: 0,
        subjectsWeek: 0,
        improvementPotential: 0
      };
    }

    // Calculate average attendance
    const totalAttendance = subjects.reduce((sum, s) => sum + (s.attendance || 0), 0);
    const avgAttendance = parseFloat((totalAttendance / subjects.length).toFixed(1));

    // Calculate average marks (normalized to 0-100)
    const totalMarks = subjects.reduce((sum, s) => {
      const marks = ((s.internalMarks || 0) + (s.externalMarks || 0) + (s.Practical || 0)) / 130 * 100;
      return sum + marks;
    }, 0);
    const avgMarks = parseFloat((totalMarks / subjects.length).toFixed(1));

    // Determine grade based on normalized marks
    let grade = 'D';
    if (avgMarks >= 90) grade = 'A+';
    else if (avgMarks >= 80) grade = 'A';
    else if (avgMarks >= 70) grade = 'B';
    else if (avgMarks >= 60) grade = 'C';

    // Calculate predicted grade considering attendance
    const projectedScore = (avgMarks * 0.7) + (avgAttendance * 0.3);
    let predictedGrade = 'D';
    if (projectedScore >= 90) predictedGrade = 'A+';
    else if (projectedScore >= 80) predictedGrade = 'A';
    else if (projectedScore >= 70) predictedGrade = 'B';
    else if (projectedScore >= 60) predictedGrade = 'C';

    // Count subjects performance
    const subjectsStrong = subjects.filter(s => {
      const marks = ((s.internalMarks || 0) + (s.externalMarks || 0) + (s.Practical || 0)) / 130 * 100;
      return marks >= 70;
    }).length;

    const subjectsWeak = subjects.filter(s => {
      const marks = ((s.internalMarks || 0) + (s.externalMarks || 0) + (s.Practical || 0)) / 130 * 100;
      return marks < 60;
    }).length;

    // Calculate improvement potential (how much could improve with better attendance)
    const improvementPotential = Math.max(0, 100 - projectedScore);

    // Calculate risk level using weighted score formula
    // Score = (TotalMarks * 0.7) + (Attendance * 0.3)
    const riskScore = (avgMarks * 0.7) + (avgAttendance * 0.3);
    
    let riskLevel = 'Low';
    if (riskScore < 45) {
      riskLevel = 'High';
    } else if (riskScore < 70) {
      riskLevel = 'Medium';
    }

    return { 
      avgAttendance, 
      avgMarks, 
      grade, 
      riskLevel, 
      riskScore,
      predictedGrade,
      subjectsStrong,
      subjectsWeak,
      improvementPotential
    };
  };

  const stats = calculateStats();

  const getRiskColor = () => {
    switch (stats.riskLevel) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  const getRiskIcon = () => {
    switch (stats.riskLevel) {
      case 'High':
        return '🔴';
      case 'Medium':
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

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Current</p>
              <h2 className="text-4xl font-bold text-purple-700">
                {stats.grade}
              </h2>
            </div>
            <div className="text-2xl">→</div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Projected</p>
              <h2 className="text-4xl font-bold text-purple-600">
                {stats.predictedGrade}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 text-xs text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>Strong in:</span>
              <span className="font-semibold text-green-600">{stats.subjectsStrong}/{subjects.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Needs work:</span>
              <span className="font-semibold text-red-600">{stats.subjectsWeak}/{subjects.length}</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 text-center">
            {stats.avgMarks >= 90 ? '🌟 Excellent Performance' : 
             stats.avgMarks >= 80 ? '✨ Very Good' :
             stats.avgMarks >= 70 ? '👍 Good' :
             stats.avgMarks >= 60 ? '⚡ Satisfactory' : '⚠️ Needs Improvement'}
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
            Score: {stats.riskScore.toFixed(1)}/100
          </p>
          <p className="text-xs text-gray-500">
            {stats.riskLevel === 'High' ? 'Score < 45' : 
             stats.riskLevel === 'Medium' ? '45 ≤ Score < 70' : 'Score ≥ 70'}
          </p>
        </div>

      </div>
    </div>
  )
}

export default Cards