import React, { useContext, useEffect, useState } from "react";
import { useSubject } from "../../context/subjectContext";
import { useAuth } from "../../context/authContext";

const SubjectSelector = () => {
  const { selectedSubject, setSelectedSubject } = useSubject();
  const {user} = useAuth();

  const semester = user?.semester;
  console.log("Sem:"+semester);
  
  const [subjects, setSubjects] = useState([]);

  // 🔥 Fetch subjects when semester changes
  useEffect(() => {
    if (!semester) return;
    
    const fetchSubjects = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/filter_subject/filter?semester=${semester}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch subjects");
        }

        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        console.error("Error fetching subjects:", err.message);
      }
    };

    fetchSubjects();
  }, [semester]);

  return (
    <div className="p-6 bg-gray-50 space-y-6">

      {/* SUBJECT CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        
         <h2 className="mb-4 text-gray-600">
          Semester: <span className="font-bold">{semester}</span>
        </h2>
           

          {/* ✅ Subject Dropdown */}
          <select
            value={selectedSubject?._id || ""}
            onChange={(e) => {
              const selected = subjects.find(
                (sub) => sub._id === e.target.value
              );
              setSelectedSubject(selected);
            }}
            disabled={!semester}
            className="w-full md:w-2/3 p-3 rounded-lg border"
          >
            <option value="">-- Select Subject --</option>

            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.subjectName}
              </option>
            ))}
          </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Students</p>
          <h3 className="text-2xl font-bold">5</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Avg Attendance</p>
          <h3 className="text-2xl font-bold text-green-600">72.7%</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Avg Marks</p>
          <h3 className="text-2xl font-bold text-purple-600">72.9%</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">At Risk</p>
          <h3 className="text-2xl font-bold text-red-500">3</h3>
        </div>

      </div>
    </div>
  );
};

export default SubjectSelector;