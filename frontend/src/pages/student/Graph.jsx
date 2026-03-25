
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

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  // Attendance values
  const attendanceValues = subjects.map(
    (s) => s.attendance
  );

  // Total marks calculation
  const marksValues = subjects.map(
    (s) => s.internalMarks + s.externalMarks
  );

  // Attendance chart data
  const attendanceData = {
    labels: subjectNames,
    datasets: [
      {
        label: "Attendance %",
        data: attendanceValues,
        backgroundColor: "#3B82F6"
      }
    ]
  };

  // Marks chart data
  const marksData = {
    labels: subjectNames,
    datasets: [
      {
        label: "Total Marks (Out of 100)",
        data: marksValues,
        backgroundColor: "#10B981"
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text:
          active === "Attendance"
            ? "Subject-wise Attendance"
            : "Subject-wise Total Marks"
      }
    }
  };

  return (
    <div className="mt-10 flex flex-col items-center">

      {/* Tabs */}
      <div className="flex bg-gray-200 rounded-full p-1 mb-6">

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

      <div className="bg-white p-6 rounded-xl shadow w-[700px]">

        {active === "Attendance" && (
          <Bar data={attendanceData} options={options} />
        )}

        {active === "Marks" && (
          <Bar data={marksData} options={options} />
        )}

        {active === "Profile" && (
          <Bar data={marksData} options={options} />
        )}

      </div>

    </div>
  );
};

export default Graph;
