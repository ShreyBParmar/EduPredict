import React from "react";

const FacultyCards = ({ students }) => {

  if (!students.length) return null;

  const totalStudents = students.length;

  const avgAttendance =
    students.reduce((a,s)=>a+s.attendance,0)/students.length;

  const avgMarks =
    students.reduce((a,s)=>a+(s.internalMarks+s.externalMarks),0)/students.length;

  const atRisk =
    students.filter(s=>s.status==="Risk").length;

  return (

    <div className="grid grid-cols-4 gap-6 p-6">

      <div className="border p-4 rounded">
        <h4>Total Students</h4>
        <p className="text-2xl">{totalStudents}</p>
      </div>

      <div className="border p-4 rounded">
        <h4>Avg Attendance</h4>
        <p className="text-2xl">
          {avgAttendance.toFixed(1)}%
        </p>
      </div>

      <div className="border p-4 rounded">
        <h4>Avg Marks</h4>
        <p className="text-2xl">
          {avgMarks.toFixed(1)}
        </p>
      </div>

      <div className="border p-4 rounded">
        <h4>At Risk</h4>
        <p className="text-2xl text-red-500">
          {atRisk}
        </p>
      </div>

    </div>
  );
};

export default FacultyCards;