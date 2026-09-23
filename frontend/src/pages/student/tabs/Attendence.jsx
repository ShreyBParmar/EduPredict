import React from "react";
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
import { useAuth } from "../../../context/authContext";
import { CalendarCheck, TrendingUp, AlertTriangle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Attendence = ({ subjects }) => {
  const { user } = useAuth();

  // Check if data is available
  if (!subjects || subjects.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500">
        <p className="text-sm font-medium">No attendance data available</p>
      </div>
    );
  }

  // Prepare attendance data from subjects
  const attendanceData = subjects.map(subject => ({
    subjectName: subject.subject?.subjectName || subject.subjectName || "Unknown",
    subjectCode: subject.subject?.subjectCode || subject.subjectCode || "N/A",
    attendance: subject.attendance || 0,
    classesHeld: subject.classesHeld || 0,
    classesAttended: subject.classesAttended || 0
  }));

  // Prepare chart data
  const chartData = {
    labels: attendanceData.map(item => item.subjectName),
    datasets: [
      {
        label: "Attendance %",
        data: attendanceData.map(item => item.attendance),
        backgroundColor: "#2563eb",
        borderColor: "#1d4ed8",
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Subject-wise Attendance for Semester ${user?.semester || ""}`,
        color: "#0f172a",
        font: { size: 14, weight: "bold" }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "#f1f5f9" },
        ticks: {
          color: "#64748b",
          callback: function(value) {
            return value + "%";
          }
        }
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
          const attendances = attendanceData.map(item => item.attendance);
          const average = (attendances.reduce((a, b) => a + b, 0) / attendances.length).toFixed(2);
          const highest = Math.max(...attendances);
          const lowest = Math.min(...attendances);

          return (
            <>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Attendance</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{average}%</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <CalendarCheck size={20} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Highest Attendance</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{parseFloat(highest).toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <TrendingUp size={20} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lowest Attendance</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">{parseFloat(lowest).toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <AlertTriangle size={20} />
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Subject Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Subject Attendance Summary</h3>
          <span className="text-xs text-slate-500 font-medium">{attendanceData.length} Subjects Total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3.5">Subject Code</th>
                <th className="px-6 py-3.5">Subject Name</th>
                <th className="px-6 py-3.5 text-center">Attended</th>
                <th className="px-6 py-3.5 text-center">Classes Held</th>
                <th className="px-6 py-3.5 text-center">Attendance %</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceData.map((item, index) => {
                let statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                let statusText = "Good";

                if (item.attendance < 75) {
                  statusBadge = "bg-rose-50 text-rose-700 border-rose-200";
                  statusText = "Low";
                } else if (item.attendance < 85) {
                  statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
                  statusText = "Moderate";
                }

                return (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-medium text-slate-600">{item.subjectCode}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.subjectName}</td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-700">{item.classesAttended}</td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-700">{item.classesHeld}</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">
                      {parseFloat(item.attendance).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge}`}>
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="h-72">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Attendence;