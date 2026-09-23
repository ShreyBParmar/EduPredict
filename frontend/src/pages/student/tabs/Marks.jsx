import React from 'react';
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
import { Award, ArrowUpRight, ArrowDownRight } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Marks = ({ subjects }) => {
  // Function to calculate grade based on total marks out of 130
  const calculateGrade = (totalMarks) => {
    const percentage = (totalMarks / 130) * 100;
    
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  if (!subjects || subjects.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500">
        <p className="text-sm font-medium">No marks data available</p>
      </div>
    );
  }

  // Prepare marks data
  const marksData = subjects.map(subject => {
    const totalMarks = subject.totalMarks || 0;
    return {
      subjectName: subject.subject?.subjectName || subject.subjectName || "Unknown",
      subjectCode: subject.subject?.subjectCode || subject.subjectCode || "N/A",
      internalMarks: subject.internalMarks || 0,
      externalMarks: subject.externalMarks || 0,
      Practical: subject.Practical || 0,
      totalMarks: totalMarks,
      grade: calculateGrade(totalMarks)
    };
  });

  // Prepare chart data
  const chartData = {
    labels: marksData.map(item => item.subjectName),
    datasets: [
      {
        label: "Internal Marks",
        data: marksData.map(item => item.internalMarks),
        backgroundColor: "#2563eb",
        borderRadius: 6
      },
      {
        label: "External Marks",
        data: marksData.map(item => item.externalMarks),
        backgroundColor: "#059669",
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top"
      },
      title: {
        display: true,
        text: "Subject-wise Marks Breakdown",
        color: "#0f172a",
        font: { size: 14, weight: "bold" }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "#f1f5f9" },
        ticks: { color: "#64748b" }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(() => {
          const totalMarks = marksData.reduce((sum, item) => sum + item.totalMarks, 0);
          const average = (totalMarks / marksData.length).toFixed(2);
          const highest = Math.max(...marksData.map(item => item.totalMarks));
          const lowest = Math.min(...marksData.map(item => item.totalMarks));

          return (
            <>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{average}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Award size={20} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Highest Total</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{highest}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lowest Total</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">{lowest}</p>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <ArrowDownRight size={20} />
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Subject Marks Details</h3>
          <span className="text-xs text-slate-500 font-medium">{marksData.length} Subjects Evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3.5">Subject</th>
                <th className="px-6 py-3.5 text-center">Internal (30)</th>
                <th className="px-6 py-3.5 text-center">External (70)</th>
                <th className="px-6 py-3.5 text-center">Practical (30)</th>
                <th className="px-6 py-3.5 text-center">Total (130)</th>
                <th className="px-6 py-3.5 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marksData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{item.subjectName}</div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">{item.subjectCode}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-700">{item.internalMarks}</td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-700">{item.externalMarks}</td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-700">{item.Practical}</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600">{item.totalMarks}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {item.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="h-72">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Marks;