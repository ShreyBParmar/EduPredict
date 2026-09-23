import React from "react";
import { Users, CalendarCheck, Award, AlertTriangle } from "lucide-react";

const FacultyCards = ({ students = [] }) => {
  if (!students.length) return null;

  const totalStudents = students.length;

  const avgAttendance =
    students.reduce((a, s) => a + (s.attendance || 0), 0) / students.length;

  const avgMarks =
    students.reduce((a, s) => a + ((s.internalMarks || 0) + (s.externalMarks || 0)), 0) / students.length;

  const atRisk =
    students.filter(s => s.status === "Risk" || s.riskLevel === "High").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalStudents}</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Users size={20} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Attendance</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{avgAttendance.toFixed(1)}%</p>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <CalendarCheck size={20} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Marks</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{avgMarks.toFixed(1)}</p>
        </div>
        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <Award size={20} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">At Risk</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{atRisk}</p>
        </div>
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
          <AlertTriangle size={20} />
        </div>
      </div>
    </div>
  );
};

export default FacultyCards;