/**
 * Risk Analysis Utility
 * Calculates risk level based on attendance and TOTAL MARKS
 */

/**
 * Determine risk level based on attendance and TOTAL MARKS
 * 
 * @param {number} attendance - Attendance percentage (0-100)
 * @param {number} totalMarks - TOTAL MARKS = InternalMarks + ExternalMarks + PracticalMarks
 * @returns {string} Risk level: "High" | "Medium" | "Low"
 * 
 * RISK THRESHOLDS:
 * - High Risk:   Attendance < 60%  OR  TotalMarks < 35
 * - Medium Risk: Attendance 60-74% OR  TotalMarks 35-49
 * - Low Risk:    Attendance ≥ 75%  AND TotalMarks ≥ 50
 */
export const getRiskLevel = (attendance, totalMarks) => {
  // Ensure values are numbers and within valid range
  const att = Math.max(0, Math.min(100, Number(attendance) || 0));
  const marks = Math.max(0, Number(totalMarks) || 0);

  // High Risk: Attendance < 60% OR Total Marks < 35
  if (att < 60 || marks < 35) {
    return "High";
  }

  // Medium Risk: Attendance between 60–74% OR Marks between 35–49
  if ((att >= 60 && att < 75) || (marks >= 35 && marks < 50)) {
    return "Medium";
  }

  // Low Risk: Attendance ≥ 75% AND Marks ≥ 50
  if (att >= 75 && marks >= 50) {
    return "Low";
  }

  // Default to Medium if conditions don't match perfectly
  return "Medium";
};

/**
 * Get color for risk level
 * @param {string} riskLevel - Risk level: "High" | "Medium" | "Low"
 * @returns {object} Color object with bg, text, border
 */
export const getRiskColor = (riskLevel) => {
  const colors = {
    High: {
      bg: "bg-red-50",
      text: "text-red-700",
      badge: "bg-red-500",
      border: "border-red-500",
      chart: "#ef4444"
    },
    Medium: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      badge: "bg-yellow-500",
      border: "border-yellow-500",
      chart: "#eab308"
    },
    Low: {
      bg: "bg-green-50",
      text: "text-green-700",
      badge: "bg-green-500",
      border: "border-green-500",
      chart: "#22c55e"
    }
  };

  return colors[riskLevel] || colors.Medium;
};

/**
 * Count students by risk level
 * @param {array} students - Array of student objects with riskLevel
 * @returns {object} Count of students in each risk category
 */
export const countByRiskLevel = (students) => {
  return {
    High: students.filter(s => s.riskLevel === "High").length,
    Medium: students.filter(s => s.riskLevel === "Medium").length,
    Low: students.filter(s => s.riskLevel === "Low").length,
    total: students.length
  };
};
