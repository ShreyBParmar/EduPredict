import { useState } from "react";
import Analytics from "./tabs/Analytics";
import MarkAttendence from "./tabs/MarkAttendence";
import UploadMarks from "./tabs/UploadMarks";
import RiskStudent from "./tabs/RiskStudent";

const FacultyGraph = ({ subjects = [] }) => {
  const [active, setActive] = useState("Analytics");

  const tabs = ["Analytics", "Mark Attendance", "Upload Marks", "At-Risk Student"];

  // ---------------- DATA PROCESSING ----------------
  const subjectNames = subjects.map(s => s.subject?.subjectName || "Sub");

  const attendanceValues = subjects.map(s => s.attendance || 0);

  const marksValues = subjects.map(
    s => (s.internalMarks || 0) + (s.externalMarks || 0)
  );

  return (
    <div className="mt-5 ml-5 flex flex-col">

      {/* ---------------- TABS ---------------- */}
      <div className="flex bg-gray-200 rounded-full p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition
            ${
              active === tab
                ? "bg-white shadow text-black"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------------- GRAPH SECTION ---------------- */}
      <div className="w-full max-w-5xl">

        {/* ANALYTICS TAB */}
        {active === "Analytics" && (<Analytics />)}

        {/* ATTENDANCE TAB */}
        {active === "Mark Attendance" && (<MarkAttendence />)}

        {/* MARKS TAB */}
        {active === "Upload Marks" && (<UploadMarks />)}

        {/* RISK TAB */}
        {active === "At-Risk Student" && (<RiskStudent />)}

      </div>
    </div>
  );
};

export default FacultyGraph;