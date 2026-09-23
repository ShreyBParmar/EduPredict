import React from 'react';
import { Calendar, Award, TrendingUp, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

const Cards = ({ subjects = [] }) => {
  
  // Calculate real-time data - PRESERVED LOGIC
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
        subjectsWeak: 0,
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

  const getRiskBadgeStyle = () => {
    switch (stats.riskLevel) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getRiskIcon = () => {
    switch (stats.riskLevel) {
      case 'High':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'Medium':
        return <Shield className="w-5 h-5 text-amber-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Attendance Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance</span>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {stats.avgAttendance}%
          </h2>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, Math.max(0, stats.avgAttendance))}%` }}
            ></div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-medium">
          Evaluated across <span className="font-semibold text-slate-700">{subjects.length} subjects</span>
        </p>
      </div>

      {/* Average Marks Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Marks</span>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.avgMarks}
            </h2>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, Math.max(0, stats.avgMarks))}%` }}
            ></div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-medium">
          Normalized score out of 100
        </p>
      </div>

      {/* Predicted Grade Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Predicted Grade</span>
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current</p>
            <p className="text-2xl font-bold text-slate-800">{stats.grade}</p>
          </div>
          <span className="text-slate-300 font-bold">→</span>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">Projected</p>
            <p className="text-2xl font-bold text-purple-700">{stats.predictedGrade}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
          <span>Strong: <strong className="text-emerald-600">{stats.subjectsStrong}</strong></span>
          <span>Needs Work: <strong className="text-rose-600">{stats.subjectsWeak}</strong></span>
        </div>
      </div>

      {/* Risk Level Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</span>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            {getRiskIcon()}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getRiskBadgeStyle()}`}>
              {stats.riskLevel} Risk
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Score: {stats.riskScore.toFixed(1)}/100
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-medium">
          {stats.riskLevel === 'High' ? 'Score < 45 (Attention Required)' : 
           stats.riskLevel === 'Medium' ? '45 ≤ Score < 70 (Moderate Risk)' : 'Score ≥ 70 (Low Academic Risk)'}
        </p>
      </div>
    </div>
  );
};

export default Cards;