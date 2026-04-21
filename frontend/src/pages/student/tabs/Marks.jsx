import React from 'react'
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

const Marks = ({ subjects }) => {
  if (!subjects || subjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">No marks data available</p>
      </div>
    );
  }

  // Prepare marks data
  const marksData = subjects.map(subject => ({
    subjectName: subject.subject?.subjectName || subject.subjectName || "Unknown",
    subjectCode: subject.subject?.subjectCode || subject.subjectCode || "N/A",
    internalMarks: subject.internalMarks || 0,
    externalMarks: subject.externalMarks || 0,
    assignment: subject.assignment || 0,
    totalMarks: subject.totalMarks || 0,
    grade: subject.grade || "-"
  }));

  // Prepare chart data
  const chartData = {
    labels: marksData.map(item => item.subjectName),
    datasets: [
      {
        label: "Internal Marks",
        data: marksData.map(item => item.internalMarks),
        backgroundColor: "#3B82F6",
        borderRadius: 4
      },
      {
        label: "External Marks",
        data: marksData.map(item => item.externalMarks),
        backgroundColor: "#10B981",
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top"
      },
      title: {
        display: true,
        text: "Subject-wise Marks Breakdown"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Marks Overview</h2>
        <Bar data={chartData} options={chartOptions} height={300} />
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Subject Marks Details</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Internal</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">External</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Assignment</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Grade</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    <div>{item.subjectName}</div>
                    <div className="text-xs text-gray-500">{item.subjectCode}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.internalMarks}/30</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.externalMarks}/70</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.assignment}</td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">{item.totalMarks}/100</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      {item.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {(() => {
          const totalMarks = marksData.reduce((sum, item) => sum + item.totalMarks, 0);
          const average = (totalMarks / marksData.length).toFixed(2);
          const highest = Math.max(...marksData.map(item => item.totalMarks));
          const lowest = Math.min(...marksData.map(item => item.totalMarks));

          return (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-2">Average Marks</p>
                <p className="text-3xl font-bold text-blue-600">{average}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-2">Highest Marks</p>
                <p className="text-3xl font-bold text-green-600">{highest}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-2">Lowest Marks</p>
                <p className="text-3xl font-bold text-red-600">{lowest}</p>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  )
}

export default Marks