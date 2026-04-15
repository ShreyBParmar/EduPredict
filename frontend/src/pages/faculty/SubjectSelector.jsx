import React, { useEffect, useState } from "react";
import { useSubject } from "../../context/subjectContext";

const SubjectSelector = () => {
  const {selectedSubject,setSelectedSubject}=useSubject()

  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
//  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(()=>{
    const fetchSubject=async ()=>{
    if(!semester) return;

    try{
      const res=await fetch(`http://localhost:5000/api/filter_subject/filter?semester=${semester}`)
      if (!res.ok) {
        throw new Error("Failed to fetch subjects");
      }
      
      const data = await res.json();
      setSubjects(data)
    }
    catch(err){
      console.error("Error fetching subjects:", err.message);
    }}

    fetchSubject();
  },[semester])

  return (
   <div className="p-6 bg-gray-50 space-y-6">

      {/* SUBJECT CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-0.4">
        <h2 className="text-lg font-semibold">Select Subject</h2>
        <p className="text-gray-500 text-sm mb-4">
          Choose a subject to view analytics and manage
        </p>

        {/* SEM + SUBJECT */}
        <div className="flex gap-4 flex-col md:flex-row">

          {/* Semester */}
          <select
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              setSelectedSubject("");
            }}
            className="w-full md:w-1/3 p-3 rounded-lg focus:outline-none disabled:bg-gray-100"
          >
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7].map((sem) => (
              <option key={sem} value={sem}>
                Sem {sem}
              </option>
            ))}
          </select>

          {/* Subject */}
         <select
          value={selectedSubject?._id || ""}
          onChange={(e) => {
            const selected = subjects.find(
              (sub) => sub._id === e.target.value
            );
            setSelectedSubject(selected); // ✅ store full object
          }}
          disabled={!semester}
          className="w-full md:w-2/3 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
>
          <option value="">-- Select Subject --</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.subjectName}
            </option>
          ))}
        </select>

        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl shadow-sm ">
          <p className="text-gray-500 text-sm">Total Students</p>
          <h3 className="text-2xl font-bold">5</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm ">
          <p className="text-gray-500 text-sm">Avg Attendance</p>
          <h3 className="text-2xl font-bold text-green-600">72.7%</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Avg Marks</p>
          <h3 className="text-2xl font-bold text-purple-600">72.9%</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm ">
          <p className="text-gray-500 text-sm">At Risk</p>
          <h3 className="text-2xl font-bold text-red-500">3</h3>
        </div>

      </div>

    </div>
  );
};

export default SubjectSelector;