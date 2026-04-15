import React from 'react'

const RiskStudent = () => {
   // ---------------- RISK (DYNAMIC) ----------------
  const riskyCount = subjects.filter(
    s => s.attendance < 75 || (s.internalMarks + s.externalMarks) < 50
  ).length;

  const safeCount = subjects.length - riskyCount;

  const riskData = {
    labels: ["At Risk", "Safe"],
    datasets: [
      {
        data: [riskyCount, safeCount],
        backgroundColor: ["#EF4444", "#22C55E"]
      }
    ]
  };

  return (
    <div>RiskStudent</div>
  )
}

export default RiskStudent