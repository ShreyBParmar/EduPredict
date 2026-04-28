import React, { useState } from "react";
import { useSubject } from "../../context/subjectContext";
import { useAuth } from "../../context/authContext";

const SubjectSelector = () => {
  const { selectedSubject, setSelectedSubject } = useSubject();
  const { user } = useAuth();

  const semesters = user?.semester || [];
  const subjects = user?.subjects || [];

  const [selectedSemester, setSelectedSemester] = useState("");

  const filteredSubjects = subjects.filter(
    (s) => s.semester === Number(selectedSemester)
  );

  return (
    <div className="p-6 bg-gray-50 space-y-6">

      <div className="flex flex-col md:flex-row gap-4">

  {/* Semester Dropdown */}
  <select
    value={selectedSemester}
    onChange={(e) => {
      setSelectedSemester(e.target.value);
      setSelectedSubject(null);
    }}
    className="w-full md:w-1/2 p-3 rounded-lg border"
  >
    <option value="">-- Select Semester --</option>
    {semesters.map((sem) => (
      <option key={sem} value={sem}>
        Semester {sem}
      </option>
    ))}
  </select>

  {/* Subject Dropdown */}
  <select
    value={selectedSubject?._id || ""}
    onChange={(e) => {
      const selected = filteredSubjects.find(
        (sub) => sub._id === e.target.value
      );
      setSelectedSubject(selected);
    }}
    disabled={!filteredSubjects.length}
    className="w-full md:w-1/2 p-3 rounded-lg border"
  >
    <option value="">
      {filteredSubjects.length === 0
        ? "No subjects available"
        : "-- Select Subject --"}
    </option>

    {filteredSubjects.map((sub) => (
      <option key={sub._id} value={sub._id}>
        {sub.subjectName}
      </option>
    ))}
  </select>

</div>

    </div>
  );
};

export default SubjectSelector;