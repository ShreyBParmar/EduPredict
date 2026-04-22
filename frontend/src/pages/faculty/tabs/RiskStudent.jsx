import { useEffect, useState } from "react";
import axios from "axios";
import { useSubject } from "../../../context/subjectContext";

const RiskStudent = () => {
  const { selectedSubject } = useSubject();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSubject?._id) {
      fetchRiskStudents();
    }
  }, [selectedSubject]);

  const fetchRiskStudents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/api/student/risk-students?subjectId=${selectedSubject._id}`
      );

      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Summary counts
  const highCount = students.filter(s => s.riskLevel === "High").length;
  const mediumCount = students.filter(s => s.riskLevel === "Medium").length;
  const lowCount = students.filter(s => s.riskLevel === "Low").length;

  if (!selectedSubject) {
    return (
      <div className="p-6 text-yellow-600 font-semibold">
        ⚠️ Select a subject first
      </div>
    );
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50">

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-4">
        🚨 Student Risk Analysis
      </h2>

      {/* SUMMARY */}
      <div className="flex gap-4 mb-6">
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold">
          High: {highCount}
        </div>
        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-semibold">
          Medium: {mediumCount}
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
          Low: {lowCount}
        </div>
      </div>

      {/* LIST */}
      {students.length === 0 ? (
        <p className="text-gray-500">
          No data available (Add marks first)
        </p>
      ) : (
        <div className="space-y-3">

          {students
            // 🔥 Sort: High → Medium → Low
            .sort((a, b) => {
              const order = { High: 1, Medium: 2, Low: 3 };
              return order[a.riskLevel] - order[b.riskLevel];
            })
            .map((s, i) => {

              const riskColor =
                s.riskLevel === "High"
                  ? "bg-red-500"
                  : s.riskLevel === "Medium"
                  ? "bg-yellow-500"
                  : "bg-green-500";

              const borderColor =
                s.riskLevel === "High"
                  ? "border-red-500"
                  : s.riskLevel === "Medium"
                  ? "border-yellow-500"
                  : "border-green-500";

              return (
                <div
                  key={i}
                  className={`p-4 bg-white rounded-lg shadow flex justify-between items-center border-l-4 ${borderColor}`}
                >
                  {/* LEFT */}
                  <div>
                    <div className="font-semibold text-gray-800">
                      {s.student?.fullName}
                    </div>

                    <div className="text-sm text-gray-500">
                      Marks: <span className="font-medium">{s.totalMarks} / 100</span>
                    </div>

                    <div className="text-sm text-gray-500">
                      Attendance: <span className="font-medium">{s.attendance}%</span>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div
                    className={`px-4 py-1 rounded text-white font-semibold ${riskColor}`}
                  >
                    {s.riskLevel}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default RiskStudent;