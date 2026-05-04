/**
 * Frontend Risk Analysis Utilities
 * NOTE: "marks" parameter always refers to TOTAL MARKS (Internal + External + Practical)
 */

/**
 * Determine risk level based on attendance and TOTAL MARKS
 * 
 * @param {number} attendance - Attendance percentage (0-100)
 * @param {number} marks - TOTAL MARKS (= internalMarks + externalMarks + practicalMarks)
 * @returns {string} Risk level: "High" | "Medium" | "Low"
 * 
 * RISK THRESHOLDS:
 * - High Risk:   Attendance < 60%  OR  TotalMarks < 35
 * - Medium Risk: Attendance 60-74% OR  TotalMarks 35-49
 * - Low Risk:    Attendance ≥ 75%  AND TotalMarks ≥ 50
 */
export const getRiskLevel = (attendance, marks) => {
  const att = Math.max(0, Math.min(100, Number(attendance) || 0));
  const totalMarks = Math.max(0, Number(marks) || 0);

  if (totalMarks < 35) {
    return "High";
  }

  if ((totalMarks >= 35 && totalMarks < 50)) {
    return "Medium";
  }

  if (totalMarks >= 50) {
    return "Low";
  }

  return "Medium";
};

export const getRiskColors = {
  High: {
    bg: "bg-red-50",
    text: "text-red-700",
    badge: "bg-red-500 text-white",
    border: "border-l-4 border-red-500",
    light: "text-red-600"
  },
  Medium: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    badge: "bg-yellow-500 text-white",
    border: "border-l-4 border-yellow-500",
    light: "text-yellow-600"
  },
  Low: {
    bg: "bg-green-50",
    text: "text-green-700",
    badge: "bg-green-500 text-white",
    border: "border-l-4 border-green-500",
    light: "text-green-600"
  }
};

export const getChartColors = {
  High: "#ef4444",
  Medium: "#eab308",
  Low: "#22c55e"
};
