import React from "react";
import { useSubject } from "../../context/subjectContext";
import { useAuth } from "../../context/authContext";

const SubjectSelector = () => {
  const { selectedSubject, setSelectedSubject } = useSubject();
  const { user } = useAuth();

  const semester = user?.semester;
  const subjects = user?.subjects || []; // ✅ safe

  console.log("Sem:", semester);
  console.log("Subjects:", subjects);

  return (
    <div className="p-6 bg-gray-50 space-y-6">

      <div className="bg-white p-6 rounded-2xl shadow-sm">

        <h2 className="mb-4 text-gray-600">
          Semester: <span className="font-bold">{semester}</span>
        </h2>

        <select
          value={selectedSubject?._id || ""}
          onChange={(e) => {
            const selected = subjects.find(
              (sub) => sub._id === e.target.value
            );
            setSelectedSubject(selected);
          }}
          disabled={!subjects.length}
          className="w-full md:w-2/3 p-3 rounded-lg border"
        >
          <option value="">
            {subjects.length === 0
              ? "No subjects assigned"
              : "-- Select Subject --"}
          </option>

          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.subjectName} {/* ✅ FIXED */}
            </option>
          ))}
        </select>

      </div>

    </div>
  );
};

export default SubjectSelector;