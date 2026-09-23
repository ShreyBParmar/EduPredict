import React, { useState } from "react";
import { useSubject } from "../../context/subjectContext";
import { useAuth } from "../../context/authContext";
import { BookOpen, Calendar, Filter } from "lucide-react";

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
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Filter className="w-4 h-4 text-blue-600" />
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Course Selection Filter</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Semester Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-400" />
            <span>Select Semester</span>
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              setSelectedSubject(null);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all outline-none cursor-pointer"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <BookOpen size={14} className="text-slate-400" />
            <span>Select Subject</span>
          </label>
          <select
            value={selectedSubject?._id || ""}
            onChange={(e) => {
              const selected = filteredSubjects.find(
                (sub) => String(sub._id) === String(e.target.value)
              );

              if (selected) {
                setSelectedSubject({
                  _id: selected._id,
                  subjectName: selected.subjectName,
                  semester: selected.semester
                });
              } else {
                setSelectedSubject(null);
              }
            }}
            disabled={!filteredSubjects.length}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
          >
            <option value="">
              {filteredSubjects.length === 0
                ? selectedSemester ? "No subjects assigned to this semester" : "-- Select Semester First --"
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
    </div>
  );
};

export default SubjectSelector;