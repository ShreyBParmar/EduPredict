import { useEffect, useState } from "react";
import axios from "axios";
import { useSubject } from "../../../context/subjectContext";
import { useAuth } from "../../../context/authContext";
import { getRiskColors, getChartColors } from "../../../utils/riskAnalysis";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const RiskStudent = () => {
  const { selectedSubject } = useSubject();
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("risk"); // "risk", "name", "attendance", "marks"
  const [filterBy, setFilterBy] = useState("all"); // "all", "High", "Medium", "Low"
  const [summary, setSummary] = useState({ High: 0, Medium: 0, Low: 0, total: 0 });

  // Fetch risk students
  useEffect(() => {
    if (selectedSubject?._id) {
      fetchRiskStudents();
    }
  }, [selectedSubject]);

  // Apply filtering and sorting
  useEffect(() => {
    let filtered = [...students];

    // Filter by risk level
    if (filterBy !== "all") {
      filtered = filtered.filter(s => s.riskLevel === filterBy);
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
          const order = { High: 1, Medium: 2, Low: 3 };
          return order[a.riskLevel] - order[b.riskLevel];
      }
    });

    setFilteredStudents(filtered);
  }, [students, sortBy, filterBy]);

  const fetchRiskStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📡 Fetching risk students for subject:", selectedSubject._id);

      const res = await axios.get(
        `http://localhost:5000/api/student/risk-students?subjectId=${selectedSubject._id}&semester=${selectedSubject?.semester || ""}`
      );

      console.log("📥 Response:", res.data);

      if (res.data.success) {
        setStudents(res.data.students || []);
        setSummary(res.data.summary || { High: 0, Medium: 0, Low: 0, total: 0 });
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
        data: [summary.High, summary.Medium, summary.Low],
        backgroundColor: [
          getChartColors.High,
          getChartColors.Medium,
          getChartColors.Low,
        ],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: { size: 12, weight: "bold" },
        },
      },
    },
  };

  // If no subject selected
  if (!selectedSubject) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          ⚠️ Select a subject first to view at-risk students
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-600">Loading risk analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          ❌ Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🚨 Student Risk Analysis
        </h2>
        <p className="text-gray-600">
          Subject: <span className="font-semibold">{selectedSubject?.subjectName}</span>
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
          <div className="text-sm text-gray-600">High Risk</div>
          <div className="text-2xl font-bold text-red-600">{summary.High}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Medium Risk</div>
          <div className="text-2xl font-bold text-yellow-600">{summary.Medium}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Low Risk</div>
          <div className="text-2xl font-bold text-green-600">{summary.Low}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">Total Students</div>
          <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
        </div>
      </div>

      {/* CHART & CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
          <div className="flex justify-center">
            {summary.total === 0 ? (
              <div className="text-gray-400 text-center py-12">
                No data available
              </div>
            ) : (
              <Doughnut data={chartData} options={chartOptions} height={250} />
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="lg:col-span-2 space-y-4">
          {/* SORT & FILTER */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filters & Sort</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="risk">Risk Level</option>
                  <option value="name">Student Name</option>
                  <option value="attendance">Attendance ↓</option>
                  <option value="marks">Marks ↓</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Filter By Risk
                </label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Students</option>
                  <option value="High">High Risk Only</option>
                  <option value="Medium">Medium Risk Only</option>
                  <option value="Low">Low Risk Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* INFO BOX */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            💡 <strong>Risk Criteria (Marks = Total Marks):</strong> High Risk: Att&lt;60% OR TotalMarks&lt;35 | Medium Risk: Att 60-74% OR TotalMarks 35-49 | Low Risk: Att≥75% AND TotalMarks≥50
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredStudents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {students.length === 0
                ? "No student data available. Upload marks first."
                : `No students match the filter "${filterBy}"`}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Enrollment ID
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Attendance %
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Marks (Internal + External + Practical)
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Total Marks (Used for Risk Calculation)
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.map((student) => {
                  const colors = getRiskColors[student.riskLevel];
                  return (
                    <tr
                      key={student._id}
                      className={`${colors.bg} hover:bg-gray-50 transition`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.enrollmentId || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        <div className="flex justify-center gap-2">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            I: {student.internalMarks}
                          </span>
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                            E: {student.externalMarks}
                          </span>
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                            P: {student.Practical}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-bold">
                          {student.totalMarks}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-4 py-1 rounded-full text-sm font-bold text-white ${colors.badge}`}
                        >
                          {student.riskLevel}
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

      {/* FOOTER INFO */}
      {filteredStudents.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredStudents.length} of {summary.total} students
        </div>
      )}
    </div>
  );
};

export default RiskStudent;
