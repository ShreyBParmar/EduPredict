
{/* 
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Graph() {

  const [active, setActive] = useState("Attendance");

  const tabs = ["Attendance", "Marks","Profile"];

  const subjects = [
    "Math",
    "Physics",
    "Chemistry",
    "DBMS",
    "OS"
  ];

  const attendanceData = {
    labels: subjects,
    datasets: [
      {
        label: "Attendance %",
        data: [85, 78, 92, 70, 88],
        backgroundColor: "#3B82F6"
      }
    ]
  };

  const marksData = {
    labels: subjects,
    datasets: [
      {
        label: "Marks",
        data: [78, 65, 90, 72, 80],
        backgroundColor: "#10B981"
      }
    ]
  };

  return (
    <div className="mt-10">

      {/* Tabs 
      <div className="flex bg-gray-200 rounded-full p-1 w-fit mb-6 space-x-3">

        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition
            ${active === tab
                ? "bg-white shadow text-black"
                : "text-gray-600 hover:bg-white"
              }`}
          >
            {tab}
          </button>
        ))}

      </div>

      {/* Graph 

      <div className="bg-white p-6 rounded-xl shadow w-[600px]">

        {active === "Attendance" && (
          <Bar data={attendanceData} />
        )}

        {active === "Marks" && (
          <Bar data={marksData} />
        )}

      </div>

        {/* Details 
        {
          
        }
    </div>
  );
}
*/}

import React, { useState } from "react";
import Attendence from "./tabs/Attendence";
import Marks from "./tabs/Marks";
import Profile from "./tabs/Profile";

const Graph = ({ subjects }) => {

  const [active, setActive] = useState("Attendance");

  const tabs = ["Attendance", "Marks","Profile"];

  // If no data yet
  if (!subjects || subjects.length === 0) {
    return <p className="mt-10">Loading graphs...</p>;
  }

  // Extract subject names
  const subjectNames = subjects.map(
    (s) => s.subject.subjectName
  );

  return (
    <div className="mt-5 ml-5 flex flex-col">

      {/* Tabs */}
      <div className="flex bg-gray-200 rounded-full p-1 mb-6 w-fit">

        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition
            ${
              active === tab
                ? "bg-white shadow text-black"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            {tab}
          </button>
        ))}

      </div>

      {/* Graph Container */}

      <div className="w-full max-w-5xl">

        {active === "Attendance" && (
          <Attendence subjects={subjects} />
        )}

        {active === "Marks" && (
          <Marks subjects={subjects} />
        )}

        {active === "Profile" && (
          <Profile subjects={subjects} />
        )}

      </div>

    </div>
  );
};

export default Graph;
