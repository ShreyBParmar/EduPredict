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
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">No attendance data available</p>
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
        backgroundColor: "#3B82F6",
        borderColor: "#1E40AF",
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top"
      },
      title: {
        display: true,
        text: `Subject-wise Attendance for Semester ${user?.semester || ""}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + "%";
          }
        }
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Overview</h2>
        <Bar data={chartData} options={chartOptions} height={300} />
      </div>

      {/* Subject List Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Subject Attendance Summary</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject Name</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Classes Attended</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Classes Held</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Attendance %</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((item, index) => {
                // Determine status based on attendance percentage
                let statusColor = "text-green-600";
                let statusBg = "bg-green-100";
                let statusText = "Good";

                if (item.attendance < 75) {
                  statusColor = "text-red-600";
                  statusBg = "bg-red-100";
                  statusText = "Low";
                } else if (item.attendance < 85) {
                  statusColor = "text-yellow-600";
                  statusBg = "bg-yellow-100";
                  statusText = "Moderate";
                }

                return (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">{item.subjectCode}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.subjectName}</td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">{item.classesAttended}</td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">{item.classesHeld}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">{item.attendance}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBg} ${statusColor}`}>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {(() => {
          const attendances = attendanceData.map(item => item.attendance);
          const average = (attendances.reduce((a, b) => a + b, 0) / attendances.length).toFixed(2);
          const highest = Math.max(...attendances);
          const lowest = Math.min(...attendances);

          return (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-2">Average Attendance</p>
                <p className="text-3xl font-bold text-blue-600">{average}%</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-2">Highest</p>
                <p className="text-3xl font-bold text-green-600">{highest}%</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-2">Lowest</p>
                <p className="text-3xl font-bold text-red-600">{lowest}%</p>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Attendence;