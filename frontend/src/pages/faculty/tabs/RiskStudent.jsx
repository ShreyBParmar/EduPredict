import { useEffect, useState } from "react";
import axios from "axios";
import { useSubject } from "../../../context/subjectContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, Filter, ArrowUpDown, Info } from "lucide-react";
import { Skeleton, SkeletonKPICards, SkeletonTable } from "../../../components/ui/Skeleton";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const orderMap = {
  "High": 1,
  "Medium": 2,
  "Low": 3
};

const RiskStudent = () => {
  const { selectedSubject } = useSubject();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("risk"); // "risk", "name", "attendance", "marks"
  const [filterBy, setFilterBy] = useState("all"); // "all", "High", "Medium", "Low"
  const [summary, setSummary] = useState({ High: 0, Medium: 0, Low: 0, total: 0 });

  // Fetch risk students
  useEffect(() => {
    if (selectedSubject?._id && selectedSubject?.semester) {
      fetchRiskStudents();
    }
  }, [selectedSubject?._id, selectedSubject?.semester]);

  // Apply filtering and sorting
  useEffect(() => {
    let filtered = [...students];

    // Filter by risk level
    if (filterBy !== "all") {
      filtered = filtered.filter(s => s.riskLevel.includes(filterBy));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "attendance":
          return b.attendance - a.attendance;
        case "marks":
          return b.totalMarks - a.totalMarks;
        case "risk":
        default:
          return (orderMap[a.riskLevel] || 3) - (orderMap[b.riskLevel] || 3);
      }
    });

    setFilteredStudents(filtered);
  }, [students, sortBy, filterBy]);

  const fetchRiskStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/student/risk-students?subjectId=${selectedSubject._id}&semester=${selectedSubject?.semester || ""}`
      );

      if (res.data.success) {
        setStudents(res.data.students || []);
        setSummary({
          High: res.data.summary?.High || 0,
          Medium: res.data.summary?.Medium || 0,
          Low: res.data.summary?.Low || 0,
          total: res.data.summary?.total || 0
        });
        console.log("✅ Students loaded:", res.data.students?.length);
      }
    } catch (err) {
      console.error("❌ Error fetching risk students:", err);
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const chartData = {
    labels: ["High Risk", "Medium Risk", "Low Risk"],
    datasets: [
      {
        data: [
          summary?.High || 0,
          summary?.Medium || 0,
          summary?.Low || 0
        ],
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981"]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: { size: 12, weight: "600" },
          color: "#475569"
        },
      },
    },
  };

  // If no subject selected
  if (!selectedSubject) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-500 shadow-xs">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-800">Select a Subject</p>
        <p className="text-xs text-slate-500 mt-1">Please select a subject first to view at-risk student analysis.</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3.5 w-36" />
        </div>
        <SkeletonKPICards count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <Skeleton className="h-4 w-36" />
            <div className="h-56 flex items-center justify-center">
              <Skeleton className="h-40 w-40 rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <Skeleton className="h-4 w-32" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800 space-y-1">
        <p className="font-semibold text-sm">Error Loading Risk Analysis</p>
        <p className="text-xs text-rose-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Student Risk Analysis</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Subject: <span className="font-semibold text-slate-700">{selectedSubject?.subjectName}</span>
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 border-l-4 border-l-rose-500 shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>High Risk</span>
            <ShieldAlert size={16} className="text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{summary.High || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 border-l-4 border-l-amber-500 shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Medium Risk</span>
            <Shield size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{summary.Medium || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 border-l-4 border-l-emerald-500 shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Low Risk</span>
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{summary.Low || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 border-l-4 border-l-blue-500 shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Total Enrolled</span>
            <Info size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{summary.total}</div>
        </div>
      </div>

      {/* Chart & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut Chart Card */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Risk Level Distribution</h3>
          <div className="h-56 flex items-center justify-center">
            {(summary?.High + summary?.Medium + summary?.Low) === 0 ? (
              <div className="text-slate-400 text-xs font-medium text-center py-8">
                No evaluation data available
              </div>
            ) : (
              <Doughnut data={chartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Filter size={14} className="text-blue-600" />
              <span>Filters & Sorting</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <ArrowUpDown size={12} className="text-slate-400" />
                  <span>Sort Roster By</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none cursor-pointer"
                >
                  <option value="risk">Risk Level Severity</option>
                  <option value="name">Student Name (A-Z)</option>
                  <option value="attendance">Highest Attendance ↓</option>
                  <option value="marks">Highest Marks ↓</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Filter size={12} className="text-slate-400" />
                  <span>Filter Severity</span>
                </label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none cursor-pointer"
                >
                  <option value="all">All Students</option>
                  <option value="High">High Risk Only</option>
                  <option value="Medium">Medium Risk Only</option>
                  <option value="Low">Low Risk Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Risk Formula Criteria Banner */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-950">
              <Info size={14} className="text-blue-600" />
              <span>Risk Evaluation Formula:</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed pl-5">
              Score = (Total Marks × 0.7) + (Attendance × 0.3) <br />
              <strong className="text-rose-700">High Risk:</strong> Score &lt; 45 | <strong className="text-amber-700">Medium Risk:</strong> 45 ≤ Score &lt; 70 | <strong className="text-emerald-700">Low Risk:</strong> Score ≥ 70
            </p>
          </div>
        </div>
      </div>

      {/* Roster Risk Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-xs font-semibold">
                {students.length === 0
                  ? "No student data available. Please upload marks first."
                  : `No students match the filter "${filterBy}"`}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Enrollment ID</th>
                  <th className="px-5 py-3.5 text-center">Attendance %</th>
                  <th className="px-5 py-3.5 text-center">Marks Breakdown (I / E / P)</th>
                  <th className="px-5 py-3.5 text-center">Total Marks</th>
                  <th className="px-5 py-3.5 text-center">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  if (student.riskLevel === "High") badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                  if (student.riskLevel === "Medium") badgeColor = "bg-amber-50 text-amber-700 border-amber-200";

                  return (
                    <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900">{student.name}</td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">{student.enrollmentId || "N/A"}</td>
                      <td className="px-5 py-4 text-center font-semibold text-blue-600">
                        {student.attendance}%
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex justify-center items-center gap-1.5 text-xs font-medium">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded" title="Internal Marks">I: {student.internalMarks}</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded" title="External Marks">E: {student.externalMarks}</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded" title="Practical Marks">P: {student.Practical}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-slate-900">
                        {student.totalMarks}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                          {student.riskLevel} Risk
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer Count */}
      {filteredStudents.length > 0 && (
        <div className="text-xs text-slate-500 text-center font-medium">
          Showing {filteredStudents.length} of {summary.total} evaluated students
        </div>
      )}
    </div>
  );
};

export default RiskStudent;
