import { useEffect, useState } from 'react';
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
import { useSubject } from '../../../context/subjectContext';
import { useAuth } from '../../../context/authContext';
import { getSubjectMarksData } from '../../../services/facultyApi';
import { RefreshCw, BookOpen } from 'lucide-react';
import { Skeleton, SkeletonChartsGrid, SkeletonTable } from '../../../components/ui/Skeleton';

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
  const { selectedSubject } = useSubject();
  const { user } = useAuth();
  const [marksData, setMarksData] = useState(null);
  const [classStats, setClassStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch data when subject changes
  useEffect(() => {
    if (selectedSubject?._id && user?.semester) {
      fetchMarksData();
    }
  }, [selectedSubject?._id]);

  const fetchMarksData = async () => {
    try {
      setLoading(true);
      const data = await getSubjectMarksData(selectedSubject._id, user.semester);
      setMarksData(data.studentMarks);
      setClassStats(data.classStats);
    } catch (error) {
      console.error('Error fetching marks data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data - Overview
  const analyticsData = classStats ? {
    labels: ["Avg Internal", "Avg External", "Avg Practical"],
    datasets: [
      {
        label: "Average Marks",
        data: [classStats.avgInternal, classStats.avgExternal, classStats.avgPractical],
        backgroundColor: ["#2563eb", "#059669", "#d97706"],
        borderRadius: 6
      }
    ]
  } : {
    labels: ["Attendance", "Marks", "Pass %"],
    datasets: [
      {
        label: "Overview",
        data: [0, 0, 0],
        backgroundColor: ["#2563eb", "#059669", "#d97706"],
        borderRadius: 6
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
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"]
      }
    ]
  } : {
    labels: ["Low Risk", "Medium Risk", "High Risk"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"]
      }
    ]
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 12, weight: "600" }, padding: 15 }
      },
      datalabels: { display: false }
    },
    scales: {
      y: { grid: { color: "#f1f5f9" }, ticks: { color: "#64748b" } },
      x: { grid: { display: false }, ticks: { color: "#64748b" } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    layout: { padding: 10 },
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 12, weight: "600" }, padding: 15 } },
      datalabels: {
        color: "#ffffff",
        font: { weight: "bold", size: 11 },
        formatter: (value, context) => {
          if (value === 0) return "";
          const label = context.chart.data.labels[context.dataIndex];
          return `${label.split(" ")[0]}\n${value}`;
        },
        anchor: "center",
        align: "center"
      }
    }
  };

  if (!selectedSubject) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 shadow-xs">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">No Subject Selected</h3>
        <p className="text-xs text-slate-500 mt-1">Please select a subject from the filter dropdown above to view class analytics.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-12" />
            </div>
          ))}
        </div>
        <SkeletonChartsGrid />
        <SkeletonTable rows={4} cols={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Refresh Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Class Analytics Overview</h2>
          <p className="text-xs text-slate-500">Subject: <span className="font-semibold text-slate-700">{selectedSubject?.subjectName}</span></p>
        </div>

        <button
          onClick={fetchMarksData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          title="Refresh the analytics data"
        >
          <RefreshCw size={14} className="text-slate-500" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Class Statistics Summary KPI Cards */}
      {classStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{classStats.totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avg Internal</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{classStats.avgInternal}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avg External</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{classStats.avgExternal}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avg Practical</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{classStats.avgPractical}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Avg Total</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{classStats.avgTotal}</p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Class Performance Metrics</h3>
          <div className="h-64">
            <Bar data={analyticsData} options={baseOptions} />
          </div>
        </div>

        {/* Doughnut Chart Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Student Performance Distribution</h3>
          <div className="h-64">
            <Doughnut data={riskDistribution} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Student Performance Table */}
      {marksData && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Detailed Student Marks Roster</h3>
            <span className="text-xs text-slate-500 font-medium">{marksData.length} Records Loaded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3.5">Student Name</th>
                  <th className="px-6 py-3.5 text-center">Internal</th>
                  <th className="px-6 py-3.5 text-center">External</th>
                  <th className="px-6 py-3.5 text-center">Practical</th>
                  <th className="px-6 py-3.5 text-center">Total</th>
                  <th className="px-6 py-3.5 text-center">Average Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marksData.map((student, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{student.studentName}</td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">{student.internalMarks}</td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">{student.externalMarks}</td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">{student.Practical}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">{student.totalMarks}</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">
                      {student.averageMarks.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;