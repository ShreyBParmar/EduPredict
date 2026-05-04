import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Doughnut } from "react-chartjs-2";
import { useSubject } from '../../../context/subjectContext'
import { useAuth } from '../../../context/authContext'
import { getSubjectMarksData } from '../../../services/facultyApi'

// ✅ Register EVERYTHING (including plugin)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);


const Analytics = () => {
  const { selectedSubject } = useSubject()
  const { user } = useAuth()
  const [marksData, setMarksData] = useState(null)
  const [classStats, setClassStats] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch data when subject changes
  useEffect(() => {
    if (selectedSubject?._id && user?.semester) {
      fetchMarksData()
    }
  }, [selectedSubject?._id])

  const fetchMarksData = async () => {
    try {
      setLoading(true)
      const data = await getSubjectMarksData(selectedSubject._id, user.semester)
      setMarksData(data.studentMarks)
      setClassStats(data.classStats)
    } catch (error) {
      console.error('Error fetching marks data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data - Overview
  const analyticsData = classStats ? {
    labels: ["Avg Internal", "Avg External", "Avg Practical"],
    datasets: [
      {
        label: "Average Marks",
        data: [classStats.avgInternal, classStats.avgExternal, classStats.avgPractical],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"]
      }
    ]
  } : {
    labels: ["Attendance", "Marks", "Pass %"],
    datasets: [
      {
        label: "Overview",
        data: [0, 0, 0],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"]
      }
    ]
  };

  // Prepare chart data - Risk Distribution
  const riskDistribution = marksData ? {
    labels: ["High Performers", "Average", "Low Performers"],
    datasets: [
      {
        data: [
          marksData.filter(s => s.averageMarks >= 75).length,
          marksData.filter(s => s.averageMarks >= 50 && s.averageMarks < 75).length,
          marksData.filter(s => s.averageMarks < 50).length
        ],
        backgroundColor: ["#22C55E", "#F59E0B", "#EF4444"]
      }
    ]
  } : {
    labels: ["Low Risk", "Medium Risk", "High Risk"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#22C55E", "#F59E0B", "#EF4444"]
      }
    ]
  };

  const baseOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  };

  // ✅ Doughnut specific (with labels)
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "5%",

    layout: {
      padding: 10
    },

    plugins: {
      legend: {
        position: "bottom"
      },

      datalabels: {
        color: "#fff", // 🔥 white text (important for visibility)
        font: {
          weight: "bold",
          size: 12
        },

        formatter: (value, context) => {
          if (value === 0) return ""; // hide zero

          const label = context.chart.data.labels[context.dataIndex];

          // 🔥 show short label (avoid clutter)
          return `${label.split(" ")[0]}\n${value}`;
        },

        anchor: "center",
        align: "center"
      }
    }
};

  return (
    <div>
      {!selectedSubject ? (
        <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500">
          <p>Select a subject to view analytics</p>
        </div>
      ) : loading ? (
        <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500">
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Refresh Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={fetchMarksData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              title="Refresh the analytics data"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
          </div>

          {/* Class Statistics Summary */}
          {classStats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{classStats.totalStudents}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600">Avg Internal</p>
                <p className="text-2xl font-bold text-purple-600">{classStats.avgInternal}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Avg External</p>
                <p className="text-2xl font-bold text-green-600">{classStats.avgExternal}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600">Avg Practical</p>
                <p className="text-2xl font-bold text-orange-600">{classStats.avgPractical}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <p className="text-sm text-gray-600">Avg Total</p>
                <p className="text-2xl font-bold text-indigo-600">{classStats.avgTotal}</p>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-2">
                Class Performance Metrics
              </h2>
              <div className="h-[300px]">
                <Bar
                  data={analyticsData}
                  options={{ ...baseOptions, maintainAspectRatio: false }}
                />
              </div>
            </div>

            {/* Doughnut Chart */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-2">
                Student Performance Distribution
              </h2>
              <div className="h-[300px]">
                <Doughnut
                  data={riskDistribution}
                  options={{
                    ...doughnutOptions,
                    maintainAspectRatio: false,
                    cutout: "65%"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Detailed Student Performance Table */}
          {marksData && (
            <div className="mt-6 bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">Student Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Student Name</th>
                      <th className="p-3 text-center">Internal</th>
                      <th className="p-3 text-center">External</th>
                      <th className="p-3 text-center">Practical</th>
                      <th className="p-3 text-center">Total</th>
                      <th className="p-3 text-center">Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marksData.map((student, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3">{student.studentName}</td>
                        <td className="p-3 text-center">{student.internalMarks}</td>
                        <td className="p-3 text-center">{student.externalMarks}</td>
                        <td className="p-3 text-center">{student.Practical}</td>
                        <td className="p-3 text-center font-semibold">{student.totalMarks}</td>
                        <td className="p-3 text-center font-semibold text-blue-600">
                          {student.averageMarks.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Analytics